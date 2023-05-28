use crate::db;
use crate::models;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<models::NewWordCategory>,
) -> actix_web::Result<impl Responder> {
    let category = models::NewWordCategory {
        name: body.name.clone(),
        description: body.description.clone(),
    };

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::word_categories::insert(category, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(category))
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
    query: web::Query<models::OptionalQuery>,
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

    Ok(HttpResponse::Ok().json(models::Pagination {
        count: result.len(),
        offset,
        result,
    }))
}
