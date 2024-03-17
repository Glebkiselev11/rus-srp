use super::models::{DbNewWord, DbWord};
use crate::{
    db::{
        self, categories::models::DbCategory, schema, words::models::DbWordWithCategories,
        words_categories::models::DbWordCategory,
    },
    models::{pagination::DbQueryResult, query_options::QueryOptions, word::Word},
};
use diesel::{expression::expression_types::NotSelectable, pg::Pg, prelude::*};

use crate::db::error_type::DbError;

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert(new_word: Word, conn: &mut PgConnection) -> Result<DbWordWithCategories, DbError> {
    use crate::db::schema::words::dsl;

    let new_word = DbNewWord::from(new_word);

    let word = diesel::insert_into(dsl::words)
        .values(&new_word)
        .get_result::<DbWord>(conn)?;

    join_word_with_categories(word, conn)
}

/// Run query using Diesel to find word by uid and return it.
pub fn select_by_id(id: i32, conn: &mut PgConnection) -> Result<DbWordWithCategories, DbError> {
    use crate::db::schema::words::dsl;

    let word = dsl::words
        .filter(dsl::id.eq(id))
        .first::<DbWord>(conn)
        .optional()?
        .ok_or(diesel::result::Error::NotFound)?;

    join_word_with_categories(word, conn)
}

pub fn select_all_with_filter(
    conn: &mut PgConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbWordWithCategories>, DbError> {
    use crate::db::schema::words::dsl;

    let order_by = || -> Box<dyn BoxableExpression<dsl::words, Pg, SqlType = NotSelectable>> {
        match query.get_order().as_str() {
            "rus" => Box::new(dsl::rus.asc()),
            "-rus" => Box::new(dsl::rus.desc()),
            "eng" => Box::new(dsl::eng.asc()),
            "-eng" => Box::new(dsl::eng.desc()),
            "srp_latin" => Box::new(dsl::srp_latin.asc()),
            "-srp_latin" => Box::new(dsl::srp_latin.desc()),
            "srp_cyrillic" => Box::new(dsl::srp_cyrillic.asc()),
            "-srp_cyrillic" => Box::new(dsl::srp_cyrillic.desc()),
            "image" => Box::new(dsl::image.asc()),
            "-image" => Box::new(dsl::image.desc()),
            "created_at" => Box::new(dsl::created_at.asc()),
            "-created_at" => Box::new(dsl::created_at.desc()),
            "updated_at" => Box::new(dsl::updated_at.asc().nulls_first()),
            "-updated_at" => Box::new(dsl::updated_at.desc().nulls_last()),
            "category_count" => Box::new(dsl::category_count.asc()),
            "-category_count" => Box::new(dsl::category_count.desc()),
            _ => Box::new(dsl::created_at.desc()),
        }
    };

    // Preparing values for filtering
    let search = query.get_search();
    let words_ids = if let Some(cid) = query.category_id {
        Some(db::words_categories::methods::get_words_ids_by_category_id(
            cid, conn,
        )?)
    } else {
        None
    };

    let apply_filters = || {
        let mut base_query = schema::words::table.into_boxed().filter(
            dsl::srp_cyrillic
                .like(&search)
                .or(dsl::srp_latin.like(&search))
                .or(dsl::rus.like(&search))
                .or(dsl::eng.like(&search)),
        );

        if let Some(ids) = words_ids.clone() {
            base_query = base_query.filter(dsl::id.eq_any(ids));
        }

        return base_query;
    };

    let count = apply_filters()
        .select(diesel::dsl::count_star())
        .first::<i64>(conn)?;

    let words = apply_filters()
        .order(order_by())
        .offset(query.get_offset())
        .limit(query.get_limit())
        .load::<DbWord>(conn)?;

    let words_with_categories = words
        .into_iter()
        .map(|word| join_word_with_categories(word, conn).unwrap())
        .collect::<Vec<DbWordWithCategories>>();

    return Ok(DbQueryResult {
        count,
        result: words_with_categories,
    });
}

pub fn update(
    payload: Word,
    id: i32,
    conn: &mut PgConnection,
) -> Result<DbWordWithCategories, DbError> {
    use crate::db::schema::words::dsl;

    let word: DbWord = select_by_id(id, conn)?.to_dbword().with_update(payload);

    diesel::update(dsl::words.find(id))
        .set(word.clone())
        .execute(conn)?;

    select_by_id(id, conn)
}

pub fn delete(id: i32, conn: &mut PgConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl;

    diesel::delete(dsl::words.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}

fn join_word_with_categories(
    word: DbWord,
    conn: &mut PgConnection,
) -> Result<DbWordWithCategories, DbError> {
    let categories = DbWordCategory::belonging_to(&word)
        .inner_join(schema::categories::table)
        .select(schema::categories::all_columns)
        .load::<DbCategory>(conn)
        .expect("Error on join_word_with_categories");

    Ok(DbWordWithCategories::new(word, categories))
}
