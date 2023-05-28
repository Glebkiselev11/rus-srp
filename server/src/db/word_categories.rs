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

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    offset: u32,
    search: String,
) -> Result<Vec<models::WordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl::*;

    let format = |w: &str| format!("%{}%", w.to_lowercase());

    if search.is_empty() {
        let categories = word_categories
            .limit(20)
            .offset(offset.into())
            .load::<models::WordCategory>(conn)?;

        return Ok(categories);
    }

    let categories = word_categories
        .or_filter(name.like(format(&search)))
        .or_filter(description.like(format(&search)))
        .limit(20)
        .offset(offset.into())
        .load::<models::WordCategory>(conn)?;

    Ok(categories)
}
