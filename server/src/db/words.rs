use crate::models::{
    pagination::DbQueryResult,
    query_options::QueryOptions,
    word::{DbNewWord, DbWord, NewWord, UpdateWordBody},
};
use diesel::{expression::expression_types::NotSelectable, prelude::*, sqlite::Sqlite};

type DbError = Box<dyn std::error::Error + Send + Sync>;

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
pub fn select_by_id(id: i32, conn: &mut SqliteConnection) -> Result<Option<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let word = dsl::words
        .filter(dsl::id.eq(id))
        .first::<DbWord>(conn)
        .optional()?;

    Ok(word)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let mut order_clause: Box<dyn BoxableExpression<dsl::words, Sqlite, SqlType = NotSelectable>> =
        Box::new(dsl::created_at.desc());

    if let Some(o) = &query.order {
        match o.as_str() {
            "rus" => order_clause = Box::new(dsl::rus.asc()),
            "-rus" => order_clause = Box::new(dsl::rus.desc()),
            "eng" => order_clause = Box::new(dsl::eng.asc()),
            "-eng" => order_clause = Box::new(dsl::eng.desc()),
            "srp_latin" => order_clause = Box::new(dsl::srp_latin.asc()),
            "-srp_latin" => order_clause = Box::new(dsl::srp_latin.desc()),
            "created_at" => order_clause = Box::new(dsl::created_at.asc()),
            "-created_at" => order_clause = Box::new(dsl::created_at.desc()),
            "updated_at" => order_clause = Box::new(dsl::updated_at.asc()),
            "-updated_at" => order_clause = Box::new(dsl::updated_at.desc()),
            _ => {}
        }
    }

    let count = dsl::words.count().get_result(conn)?;

    let offset = query.get_offset();

    if query.search.is_none() {
        let result = dsl::words
            .offset(offset.into())
            .order(order_clause)
            .limit(20)
            .load::<DbWord>(conn)?;

        return Ok(DbQueryResult { count, result });
    }

    let search = query.get_search();

    let result = dsl::words
        .or_filter(dsl::srp_cyrillic.like(&search))
        .or_filter(dsl::srp_latin.like(&search))
        .or_filter(dsl::rus.like(&search))
        .or_filter(dsl::eng.like(&search))
        .order(order_clause)
        .offset(offset.into())
        .limit(20)
        .load::<DbWord>(conn)?;

    Ok(DbQueryResult { count, result })
}

pub fn update(
    payload: UpdateWordBody,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let word: DbWord = match select_by_id(id, conn)? {
        Some(db_word) => db_word.with_update(payload),
        None => return Ok(None),
    };

    diesel::update(dsl::words.find(id))
        .set(word.clone())
        .execute(conn)?;

    Ok(Some(word))
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl;

    diesel::delete(dsl::words.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
