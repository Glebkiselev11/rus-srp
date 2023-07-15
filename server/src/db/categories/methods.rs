use super::models::{DbCategory, DbNewCategory};
use crate::db::models::{DbError, RecordNotFoundError};
use crate::models::{
    category::CategoryBody, pagination::DbQueryResult, query_options::QueryOptions,
};
use diesel::prelude::*;

pub fn insert(
    new_category: CategoryBody,
    conn: &mut SqliteConnection,
) -> Result<DbCategory, DbError> {
    use crate::db::schema::categories::dsl;

    let new_category = DbNewCategory::from(new_category);

    let category = diesel::insert_into(dsl::categories)
        .values(&new_category)
        .get_result::<DbCategory>(conn)?;

    Ok(category)
}

pub fn select_by_id(id: i32, conn: &mut SqliteConnection) -> Result<DbCategory, DbError> {
    use crate::db::schema::categories::dsl;

    let category = dsl::categories
        .filter(dsl::id.eq(id))
        .first::<DbCategory>(conn)
        .optional()?
        .ok_or(RecordNotFoundError::new("Category doesn't exist"))?;

    Ok(category)
}

pub fn select_all_with_filter(
    conn: &mut SqliteConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbCategory>, DbError> {
    use crate::db::schema::categories::dsl;

    let offset = query.get_offset();

    if query.search.is_none() {
        let count = dsl::categories.count().get_result(conn)?;

        let result = dsl::categories
            .limit(20)
            .offset(offset.into())
            .load::<DbCategory>(conn)?;

        return Ok(DbQueryResult { count, result });
    }

    let search = query.get_search();
    let limit = query.get_limit();

    let db_query = dsl::categories
        .or_filter(dsl::name.like(&search))
        .or_filter(dsl::description.like(&search));

    let count = db_query
        .clone()
        .select(diesel::dsl::count_star())
        .first::<i64>(conn)?;

    let result = db_query
        .offset(offset.into())
        .limit(limit)
        .load::<DbCategory>(conn)?;

    Ok(DbQueryResult { count, result })
}

pub fn update(
    payload: CategoryBody,
    id: i32,
    conn: &mut SqliteConnection,
) -> Result<Option<DbCategory>, DbError> {
    use crate::db::schema::categories::dsl;

    let category: DbCategory = select_by_id(id, conn)?.with_update(payload);

    diesel::update(dsl::categories.find(id))
        .set(category.clone())
        .execute(conn)?;

    Ok(Some(category))
}

pub fn delete(id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::categories::dsl;

    diesel::delete(dsl::categories.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
