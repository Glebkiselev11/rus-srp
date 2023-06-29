use diesel::prelude::*;

use crate::models::{
    pagination::DbQueryResult,
    query_options::QueryOptions,
    word_category::{DbNewWordCategory, DbWordCategory, WordCategoryBody},
};

type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn insert(
    new_category: WordCategoryBody,
    conn: &mut SqliteConnection,
) -> Result<DbWordCategory, DbError> {
    use crate::db::schema::word_categories::dsl;

    let new_category = DbNewWordCategory::from(new_category);

    let category = diesel::insert_into(dsl::word_categories)
        .values(&new_category)
        .get_result::<DbWordCategory>(conn)?;

    Ok(category)
}

pub fn select_by_id(
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbWordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let category = dsl::word_categories
        .filter(dsl::id.eq(id))
        .first::<DbWordCategory>(conn)
        .optional()?;

    Ok(category)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbWordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let offset = query.get_offset();

    let count = dsl::word_categories.count().get_result(conn)?;

    if query.search.is_none() {
        let result = dsl::word_categories
            .limit(20)
            .offset(offset.into())
            .load::<DbWordCategory>(conn)?;

        return Ok(DbQueryResult { count, result });
    }

    let search = query.get_search();

    let result = dsl::word_categories
        .or_filter(dsl::name.like(&search))
        .or_filter(dsl::description.like(&search))
        .limit(20)
        .offset(offset.into())
        .load::<DbWordCategory>(conn)?;

    Ok(DbQueryResult { count, result })
}

pub fn update(
    payload: WordCategoryBody,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbWordCategory>, DbError> {
    use crate::db::schema::word_categories::dsl;

    let category: DbWordCategory = match select_by_id(id, conn)? {
        Some(db_category) => db_category.with_update(payload),
        None => return Ok(None),
    };

    diesel::update(dsl::word_categories.find(id))
        .set(category.clone())
        .execute(conn)?;

    Ok(Some(category))
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::word_categories::dsl;

    diesel::delete(dsl::word_categories.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
