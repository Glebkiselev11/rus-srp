use diesel::prelude::*;
use uuid::Uuid;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

/// Run query using Diesel to insert a new database row and return the result.
pub fn insert_new_user(
    word: models::NewWord,
    conn: &SqliteConnection,
) -> Result<models::Word, DbError> {
    // It is common when using Diesel with Actix Web to import schema-related
    // modules inside a function's scope (rather than the normal module's scope)
    // to prevent import collisions and namespace pollution.
    use crate::schema::words::dsl::*;

    let new_word = models::Word {
        id: Uuid::new_v4().to_string(),
        rus: word.rus,
        srp_cyrillic: word.srp_cyrillic,
        srp_latin: word.srp_latin,
    };

    diesel::insert_into(words).values(&new_word).execute(conn)?;

    Ok(new_word)
}
