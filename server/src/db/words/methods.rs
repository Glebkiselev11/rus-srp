use super::models::{DbNewWord, DbWord};
use crate::{
    db,
    // db::words_categories::models::DbWordCategory,
    models::{
        pagination::DbQueryResult,
        query_options::QueryOptions,
        word::{NewWord, UpdateWordBody},
    },
};
use diesel::{expression::expression_types::NotSelectable, prelude::*, sqlite::Sqlite};

use crate::db::error_type::DbError;

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert(new_word: NewWord, conn: &mut SqliteConnection) -> Result<DbWord, DbError> {
    use crate::db::schema::words::dsl;

    let new_word = DbNewWord::from(new_word);

    let word = diesel::insert_into(dsl::words)
        .values(&new_word)
        .get_result::<DbWord>(conn)?;

    Ok(word)
}

/// Run query using Diesel to find word by uid and return it.
pub fn select_by_id(id: i32, conn: &mut SqliteConnection) -> Result<DbWord, DbError> {
    use crate::db::schema::words::dsl;

    let word = dsl::words
        .filter(dsl::id.eq(id))
        .first::<DbWord>(conn)
        .optional()?
        .ok_or(diesel::result::Error::NotFound)?;

    Ok(word)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let order_by = || -> Box<dyn BoxableExpression<dsl::words, Sqlite, SqlType = NotSelectable>> {
        if let Some(o) = &query.order {
            match o.as_str() {
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
                "updated_at" => Box::new(dsl::updated_at.asc()),
                "-updated_at" => Box::new(dsl::updated_at.desc()),
                _ => Box::new(dsl::created_at.desc()),
            }
        } else {
            Box::new(dsl::created_at.desc())
        }
    };

    let offset = query.get_offset();
    let limit = query.get_limit();

    let search = query.get_search();

    let base_query = dsl::words.filter(
        dsl::srp_cyrillic
            .like(&search)
            .or(dsl::srp_latin.like(&search))
            .or(dsl::rus.like(&search))
            .or(dsl::eng.like(&search)),
    );

    let mut count = 0;
    let mut result: Vec<DbWord> = Vec::new();

    if let Some(cid) = query.category_id {
        let words_ids = db::words_categories::methods::get_words_ids_by_category_id(cid, conn)?;
        let db_query = base_query.filter(dsl::id.eq_any(words_ids));

        count = db_query
            .clone()
            .select(diesel::dsl::count_star())
            .first::<i64>(conn)?;

        result = db_query
            .order(order_by())
            .offset(offset.into())
            .limit(limit.into())
            .load::<DbWord>(conn)?;
    } else {
        count = base_query
            .clone()
            .select(diesel::dsl::count_star())
            .first::<i64>(conn)?;

        result = base_query
            .order(order_by())
            .offset(offset.into())
            .limit(limit.into())
            .load::<DbWord>(conn)?;
    }

    return Ok(DbQueryResult { count, result });
}

pub fn update(
    payload: UpdateWordBody,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let word: DbWord = select_by_id(id, conn)?.with_update(payload);

    diesel::update(dsl::words.find(id))
        .set(word.clone())
        .execute(conn)?;

    Ok(Some(word))
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl;
    diesel::sql_query("PRAGMA foreign_keys = ON").execute(conn)?;

    diesel::delete(dsl::words.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
