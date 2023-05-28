use diesel::prelude::*;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert(word: models::NewWord, conn: &mut SqliteConnection) -> Result<models::Word, DbError> {
    use crate::db::schema::words::dsl;

    let format = |w: &str| w.to_lowercase();

    let new_word = models::NewWord {
        rus: format(&word.rus),
        eng: format(&word.eng),
        srp_cyrillic: format(&word.srp_cyrillic),
        srp_latin: format(&word.srp_latin),
    };

    let word = diesel::insert_into(dsl::words)
        .values(&new_word)
        .get_result::<models::Word>(conn)?;

    Ok(word)
}

/// Run query using Diesel to find word by uid and return it.
pub fn select_by_id(id: i32, conn: &mut SqliteConnection) -> Result<Option<models::Word>, DbError> {
    use crate::db::schema::words::dsl;

    let word = dsl::words
        .filter(dsl::id.eq(id))
        .first::<models::Word>(conn)
        .optional()?;

    Ok(word)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    offset: u32,
    search: String,
) -> Result<Vec<models::Word>, DbError> {
    use crate::db::schema::words::dsl;

    let format = |w: &str| format!("%{}%", w.to_lowercase());

    if search.is_empty() {
        let all_words = dsl::words
            .limit(20)
            .offset(offset.into())
            .load::<models::Word>(conn)?;

        return Ok(all_words);
    }

    let all_words = dsl::words
        .or_filter(dsl::srp_cyrillic.like(format(&search)))
        .or_filter(dsl::srp_latin.like(format(&search)))
        .or_filter(dsl::rus.like(format(&search)))
        .or_filter(dsl::eng.like(format(&search)))
        .limit(20)
        .offset(offset.into())
        .load::<models::Word>(conn)?;

    Ok(all_words)
}

pub fn update(word: models::Word, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl;

    let word_id = word.id.clone();

    diesel::update(dsl::words.find(word_id))
        .set(word)
        .execute(conn)?;

    Ok(())
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl;

    diesel::delete(dsl::words.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
