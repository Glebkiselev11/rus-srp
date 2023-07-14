use crate::db::models::{DbError, RecordNotFoundError};
use crate::db::words_categories::models;
use diesel::prelude::*;

use super::models::DbWordCategory;

pub fn insert(
    category_id: i32,
    word_id: i32,
    conn: &mut SqliteConnection,
) -> Result<DbWordCategory, DbError> {
    use crate::db::schema::words_categories::dsl;

    let new_word_category_relation = models::DbNewWordCategory::new(category_id, word_id);

    let word_category_relation = diesel::insert_into(dsl::words_categories)
        .values(&new_word_category_relation)
        .get_result::<models::DbWordCategory>(conn)?;

    Ok(word_category_relation)
}

pub fn delete(category_id: i32, word_id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words_categories::dsl;

    let relation = dsl::words_categories
        .filter(dsl::category_id.eq(category_id))
        .filter(dsl::word_id.eq(word_id))
        .get_result::<DbWordCategory>(conn)
        .optional()?
        .ok_or(RecordNotFoundError::new(
            "Relationship between word and category you provided doesn't exist",
        ))?;

    diesel::delete(dsl::words_categories.filter(dsl::id.eq(relation.id))).execute(conn)?;

    Ok(())
}
