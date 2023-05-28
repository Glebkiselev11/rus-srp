use diesel::prelude::*;
use uuid::Uuid;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

/// Run query using Diesel to find word by uid and return it.
pub fn find_word_by_uid(
    uid: Uuid,
    conn: &mut SqliteConnection,
) -> Result<Option<models::Word>, DbError> {
    use crate::db::schema::words::dsl::*;

    let word = words
        .filter(id.eq(uid.to_string()))
        .first::<models::Word>(conn)
        .optional()?;

    Ok(word)
}

pub fn get_all_words(
    conn: &mut SqliteConnection,
    offset: u32,
    search: String,
) -> Result<Vec<models::Word>, DbError> {
    use crate::db::schema::words::dsl::*;

    let format = |w: &str| format!("%{}%", w.to_lowercase());

    if search.is_empty() {
        let all_words = words
            .limit(20)
            .offset(offset.into())
            .load::<models::Word>(conn)?;

        return Ok(all_words);
    }

    let all_words = words
        .or_filter(srp_cyrillic.like(format(&search)))
        .or_filter(srp_latin.like(format(&search)))
        .or_filter(rus.like(format(&search)))
        .or_filter(eng.like(format(&search)))
        .limit(20)
        .offset(offset.into())
        .load::<models::Word>(conn)?;

    Ok(all_words)
}

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert_new_word(
    word: models::NewWord,
    conn: &mut SqliteConnection,
) -> Result<models::Word, DbError> {
    // It is common when using Diesel with Actix Web to import schema-related
    // modules inside a function's scope (rather than the normal module's scope)
    // to prevent import collisions and namespace pollution.
    use crate::db::schema::words::dsl::*;

    let format = |w: &str| w.to_lowercase();

    let new_word = models::Word {
        id: Uuid::new_v4().to_string(),
        rus: format(&word.rus),
        eng: format(&word.eng),
        srp_cyrillic: format(&word.srp_cyrillic),
        srp_latin: format(&word.srp_latin),
    };

    diesel::insert_into(words).values(&new_word).execute(conn)?;

    Ok(new_word)
}

pub fn delete(uid: Uuid, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl::*;

    diesel::delete(words.filter(id.eq(uid.to_string()))).execute(conn)?;

    Ok(())
}

pub fn update(word: models::Word, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words::dsl::*;

    let word_id = word.id.clone();

    diesel::update(words.find(word_id))
        .set(word)
        .execute(conn)?;

    Ok(())
}
