use crate::db;
use crate::models::pagination::Pagination;
use crate::models::word_category::WordCategoryBody;
use crate::models::OptionalQuery;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<WordCategoryBody>,
) -> actix_web::Result<impl Responder> {
    let category = body.into_inner();

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::word_categories::insert(category, &mut conn)
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
        db::word_categories::select_by_id(id.into_inner(), &mut conn)
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
    query: web::Query<OptionalQuery>,
) -> actix_web::Result<impl Responder> {
    let offset = match query.offset {
        None => 0,
        Some(i) => i,
    };

    let search = match &query.search {
        None => String::new(),
        Some(s) => s.clone(),
    };

    let result = web::block(move || {
        let mut conn = pool.get()?;
        db::word_categories::select_all_with_filter(&mut conn, offset, search)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(Pagination {
        count: result.len(),
        offset,
        result,
    }))
}

pub async fn update(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
    body: web::Json<WordCategoryBody>,
) -> actix_web::Result<impl Responder> {
    let category = body.into_inner();

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::word_categories::update(category, id.into_inner(), &mut conn)
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
        db::word_categories::delete(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().finish())
}
