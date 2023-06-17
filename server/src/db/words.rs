use crate::models::word::{DbNewWord, DbWord, NewWord, UpdateWordBody};
use chrono::Utc;
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
    offset: u32,
    search: String,
    order: Option<String>,
) -> Result<Vec<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let format = |w: &str| format!("%{}%", w.to_lowercase());

    let mut order_clause: Box<dyn BoxableExpression<dsl::words, Sqlite, SqlType = NotSelectable>> =
        Box::new(dsl::created_at.asc());

    if let Some(o) = order {
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

    if search.is_empty() {
        let all_words = dsl::words
            .limit(20)
            .offset(offset.into())
            .order(order_clause)
            .load::<DbWord>(conn)?;

        return Ok(all_words);
    }

    let all_words = dsl::words
        .or_filter(dsl::srp_cyrillic.like(format(&search)))
        .or_filter(dsl::srp_latin.like(format(&search)))
        .or_filter(dsl::rus.like(format(&search)))
        .or_filter(dsl::eng.like(format(&search)))
        .limit(20)
        .offset(offset.into())
        .order(order_clause)
        .load::<DbWord>(conn)?;

    Ok(all_words)
}

pub fn update(
    word: UpdateWordBody,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbWord>, DbError> {
    use crate::db::schema::words::dsl;

    let word = match select_by_id(id, conn)? {
        Some(x) => DbWord {
            updated_at: Some(Utc::now().naive_utc()),
            rus: word.rus,
            eng: word.eng,
            srp_cyrillic: word.srp_cyrillic,
            srp_latin: word.srp_latin,
            ..x
        },
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
