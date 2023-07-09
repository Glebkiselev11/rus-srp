use diesel::prelude::*;
type DbError = Box<dyn std::error::Error + Send + Sync>;
use crate::db::words_categories::models;

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
