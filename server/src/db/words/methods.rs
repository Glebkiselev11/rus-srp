use super::models::{DbNewWord, DbWord};
use crate::{
    db::{
        self,
        schema::{self, words::BoxedQuery},
        words::models::DbWordWithCategories,
        words_categories,
    },
    models::{pagination::DbQueryResult, query_options::QueryOptions, word::Word},
};
use diesel::{expression::expression_types::NotSelectable, pg::Pg, prelude::*};

use crate::db::error_type::DbError;
use crate::db::schema::words::dsl;

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert(new_word: Word, conn: &mut PgConnection) -> Result<DbWordWithCategories, DbError> {
    let new_word = DbNewWord::from(new_word);

    let word = diesel::insert_into(dsl::words)
        .values(&new_word)
        .get_result::<DbWord>(conn)?;

    words_categories::methods::join_word_with_categories(word, conn)
}

/// Run query using Diesel to find word by uid and return it.
pub fn select_by_id(id: i32, conn: &mut PgConnection) -> Result<DbWordWithCategories, DbError> {
    let word = dsl::words
        .filter(dsl::id.eq(id))
        .first::<DbWord>(conn)
        .optional()?
        .ok_or(diesel::result::Error::NotFound)?;

    words_categories::methods::join_word_with_categories(word, conn)
}

pub fn select_all_with_filter(
    conn: &mut PgConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbWordWithCategories>, DbError> {
    let order_by = prepare_order_by(query.clone());
    let (filters, conn) = prepare_filters(conn, query.clone())?;

    let words = filters
        .order(order_by())
        .offset(query.get_offset())
        .limit(query.get_limit())
        .load::<DbWord>(conn)?;

    let words_with_categories = words_categories::methods::join_words_with_categories(words, conn)?;

    return Ok(DbQueryResult {
        count: select_count_with_filter(conn, query)?,
        result: words_with_categories,
    });
}

pub fn select_count_with_filter(
    conn: &mut PgConnection,
    query: QueryOptions,
) -> Result<i64, DbError> {
    let (filters, conn) = prepare_filters(conn, query)?;

    let count = filters
        .select(diesel::dsl::count_star())
        .first::<i64>(conn)?;

    return Ok(count);
}

fn prepare_order_by(
    query: QueryOptions,
) -> impl Fn() -> Box<dyn BoxableExpression<dsl::words, Pg, SqlType = NotSelectable>> {
    return move || -> Box<dyn BoxableExpression<dsl::words, Pg, SqlType = NotSelectable>> {
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
}

fn prepare_filters(
    conn: &mut PgConnection,
    query: QueryOptions,
) -> Result<(BoxedQuery<Pg>, &mut PgConnection), DbError> {
    // Preparing values for filtering
    let search = query.get_search();
    let words_ids = if let Some(cid) = query.category_id {
        Some(db::words_categories::methods::get_words_ids_by_category_id(
            cid, conn,
        )?)
    } else {
        None
    };

    let mut base_query = schema::words::table.into_boxed().filter(
        dsl::srp_cyrillic
            .like(search.clone())
            .or(dsl::srp_latin.like(search.clone()))
            .or(dsl::rus.like(search.clone()))
            .or(dsl::eng.like(search)),
    );

    if query.must_exclude_approved_translations() {
        base_query = base_query.filter(dsl::translation_approved.eq(false));
    }

    if let Some(ids) = words_ids.clone() {
        base_query = base_query.filter(dsl::id.eq_any(ids));
    }

    return Ok((base_query, conn));
}

pub fn update(
    payload: Word,
    id: i32,
    conn: &mut PgConnection,
) -> Result<DbWordWithCategories, DbError> {
    let word: DbWord = select_by_id(id, conn)?.to_dbword().with_update(payload);

    diesel::update(dsl::words.find(id))
        .set(word.clone())
        .execute(conn)?;

    select_by_id(id, conn)
}

pub fn delete(id: i32, conn: &mut PgConnection) -> Result<(), DbError> {
    diesel::delete(dsl::words.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
