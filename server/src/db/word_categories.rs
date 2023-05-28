use chrono::Utc;
use diesel::prelude::*;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn add(
    c: models::NewWordCategory,
    conn: &mut SqliteConnection,
) -> Result<models::WordCategory, DbError> {
    use crate::db::schema::word_categories::dsl::*;

    let category = models::NewWordCategoryWithCreationDate {
        name: c.name.clone(),
        description: c.description.clone(),
        created_at: Utc::now().naive_utc(),
    };

    let category = diesel::insert_into(word_categories)
        .values(&category)
        .get_result::<models::WordCategory>(conn)?;

    Ok(category)
}
