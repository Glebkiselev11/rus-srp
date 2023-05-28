use chrono::Utc;
use diesel::prelude::*;

use crate::models;

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn insert(
    new_category: models::NewWordCategory,
    conn: &mut SqliteConnection,
) -> Result<models::WordCategory, DbError> {
    use crate::db::schema::word_categories::dsl;

    let category = models::NewWordCategoryWithCreationDate {
        name: new_category.name.clone(),
        description: new_category.description.clone(),
        created_at: Utc::now().naive_utc(),
    };

    let category = diesel::insert_into(dsl::word_categories)
        .values(&category)
        .get_result::<models::WordCategory>(conn)?;

    Ok(category)
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::word_categories::dsl;

    diesel::delete(dsl::word_categories.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}

pub fn update(
    category: models::NewWordCategory,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<models::WordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let category = match select_by_id(id, conn)? {
        Some(x) => models::WordCategory {
            updated_at: Some(Utc::now().naive_utc()),
            name: category.name,
            description: category.description,
            ..x
        },
        None => return Ok(None),
    };

    diesel::update(dsl::word_categories.find(id))
        .set(category.clone())
        .execute(conn)?;

    Ok(Some(category))
}

pub fn select_by_id(
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<models::WordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let category = dsl::word_categories
        .filter(dsl::id.eq(id))
        .first::<models::WordCategory>(conn)
        .optional()?;

    Ok(category)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    offset: u32,
    search: String,
) -> Result<Vec<models::WordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let format = |w: &str| format!("%{}%", w.to_lowercase());

    if search.is_empty() {
        let categories = dsl::word_categories
            .limit(20)
            .offset(offset.into())
            .load::<models::WordCategory>(conn)?;

        return Ok(categories);
    }

    let categories = dsl::word_categories
        .or_filter(dsl::name.like(format(&search)))
        .or_filter(dsl::description.like(format(&search)))
        .limit(20)
        .offset(offset.into())
        .load::<models::WordCategory>(conn)?;

    Ok(categories)
}
