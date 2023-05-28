use chrono::Utc;
use diesel::prelude::*;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn insert(
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

pub fn delete(_id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::word_categories::dsl::*;

    diesel::delete(word_categories.filter(id.eq(_id))).execute(conn)?;

    Ok(())
}

pub fn select_by_id(
    _id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<models::WordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl::*;

    let category = word_categories
        .filter(id.eq(_id))
        .first::<models::WordCategory>(conn)
        .optional()?;

    Ok(category)
}
