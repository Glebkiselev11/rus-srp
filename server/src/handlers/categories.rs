use crate::db;
use crate::models::category::CategoryBody;
use crate::models::pagination::Pagination;
use crate::models::query_options::QueryOptions;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<CategoryBody>,
) -> actix_web::Result<impl Responder> {
    let category = body.into_inner();

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::insert(category, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(category))
}

pub async fn get_by_id(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::select_by_id(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    match category {
        Some(x) => Ok(HttpResponse::Ok().json(x)),
        None => Ok(HttpResponse::NotFound().body("Category not found")),
    }
}

pub async fn get_list_by_query(
    pool: web::Data<DbPool>,
    query: web::Query<QueryOptions>,
) -> actix_web::Result<impl Responder> {
    let query = query.into_inner();
    let offset = query.get_offset();

    let db_guery_result = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::select_all_with_filter(&mut conn, query)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(Pagination {
        offset,
        count: db_guery_result.count,
        result: db_guery_result.result,
    }))
}

pub async fn update(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
    body: web::Json<CategoryBody>,
) -> actix_web::Result<impl Responder> {
    let category = body.into_inner();

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::update(category, id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    match category {
        Some(x) => Ok(HttpResponse::Ok().json(x)),
        None => Ok(HttpResponse::NotFound().body("Category not found")),
    }
}

pub async fn delete(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    web::block(move || {
        let mut conn = pool.get()?;
        db::categories::delete(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().finish())
}
