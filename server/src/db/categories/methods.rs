use super::models::{DbCategory, DbNewCategory};
use crate::db::error_type::DbError;
use crate::db::schema;
use crate::models::category::NewCategory;
use crate::models::{
    category::CategoryBody, pagination::DbQueryResult, query_options::QueryOptions,
};
use diesel::expression::expression_types::NotSelectable;
use diesel::pg::Pg;
use diesel::prelude::*;

pub fn insert(new_category: NewCategory, conn: &mut PgConnection) -> Result<DbCategory, DbError> {
    use crate::db::schema::categories::dsl;

    let new_category = DbNewCategory::from(new_category);

    let category = diesel::insert_into(dsl::categories)
        .values(&new_category)
        .get_result::<DbCategory>(conn)?;

    Ok(category)
}

pub fn select_by_id(id: i32, conn: &mut PgConnection) -> Result<DbCategory, DbError> {
    use crate::db::schema::categories::dsl;

    let category = dsl::categories
        .filter(dsl::id.eq(id))
        .first::<DbCategory>(conn)
        .optional()?
        .ok_or(diesel::result::Error::NotFound)?;

    Ok(category)
}

pub fn select_all_with_filter(
    conn: &mut PgConnection,
    query: QueryOptions,
) -> Result<DbQueryResult<DbCategory>, DbError> {
    use crate::db::schema::categories::dsl;

    let order_by =
        || -> Box<dyn BoxableExpression<dsl::categories, Pg, SqlType = NotSelectable>> {
            if let Some(o) = &query.order {
                match o.as_str() {
                    "rus" => Box::new(dsl::rus.asc()),
                    "-rus" => Box::new(dsl::rus.desc()),
                    "eng" => Box::new(dsl::eng.asc()),
                    "-eng" => Box::new(dsl::eng.desc()),
                    "srp_latin" => Box::new(dsl::srp_latin.asc()),
                    "-srp_latin" => Box::new(dsl::srp_latin.desc()),
                    "srp_cyrillic" => Box::new(dsl::srp_cyrillic.asc()),
                    "-srp_cyrillic" => Box::new(dsl::srp_cyrillic.desc()),
                    "created_at" => Box::new(dsl::created_at.asc()),
                    "-created_at" => Box::new(dsl::created_at.desc()),
                    "updated_at" => Box::new(dsl::updated_at.asc().nulls_first()),
                    "-updated_at" => Box::new(dsl::updated_at.desc().nulls_last()),
                    _ => Box::new(dsl::created_at.desc()),
                }
            } else {
                Box::new(dsl::created_at.desc())
            }
        };

    let offset = query.get_offset();
    let search = query.get_search();
    let limit = query.get_limit();

    let base_query = schema::categories::table.filter(
        dsl::srp_cyrillic
            .like(&search)
            .or(dsl::srp_latin.like(&search))
            .or(dsl::rus.like(&search))
            .or(dsl::eng.like(&search)),
    );

    let count = base_query
        .clone()
        .select(diesel::dsl::count_star())
        .first::<i64>(conn)?;

    let result = base_query
        .order_by(order_by())
        .offset(offset)
        .limit(limit)
        .load::<DbCategory>(conn)?;

    Ok(DbQueryResult { count, result })
}

pub fn update(
    payload: CategoryBody,
    id: i32,
    conn: &mut PgConnection,
) -> Result<Option<DbCategory>, DbError> {
    use crate::db::schema::categories::dsl;

    let category: DbCategory = select_by_id(id, conn)?.with_update(payload);

    diesel::update(dsl::categories.find(id))
        .set(category.clone())
        .execute(conn)?;

    Ok(Some(category))
}

pub fn delete(id: i32, conn: &mut PgConnection) -> Result<(), DbError> {
    use crate::db::schema::categories::dsl;
    diesel::delete(dsl::categories.filter(dsl::id.eq(id))).execute(conn)?;

    Ok(())
}
