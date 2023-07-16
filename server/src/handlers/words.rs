use super::custom_http_error::{CustomHttpError, ErrorMessagesBuilder};
use crate::db;
use crate::models::pagination::Pagination;
use crate::models::query_options::QueryOptions;
use crate::models::word::{NewWord, NewWordBody, UpdateWordBody};
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<NewWordBody>,
) -> actix_web::Result<impl Responder> {
    let new_word = NewWord::from(body.into_inner());

    // use web::block to offload blocking Diesel code without blocking server thread
    let word = web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::insert(new_word, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(word))
}

pub async fn get_list_by_query(
    pool: web::Data<DbPool>,
    query: web::Query<QueryOptions>,
) -> actix_web::Result<impl Responder> {
    let query = query.into_inner();
    let offset = query.get_offset();

    let db_query_result = web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::select_all_with_filter(&mut conn, query)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(Pagination {
        offset,
        count: db_query_result.count,
        result: db_query_result.result,
    }))
}

pub async fn get_by_id(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    let words = web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::select_by_id(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "Word not found",
            ..Default::default()
        })
        .convert_db_to_http(db_error)
    })?;

    Ok(HttpResponse::Ok().json(words))
}

pub async fn update(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
    body: web::Json<UpdateWordBody>,
) -> actix_web::Result<impl Responder> {
    let word = body.into_inner();

    let word = web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::update(word, id.into_inner(), &mut conn)
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "Word not found",
            ..Default::default()
        })
        .convert_db_to_http(db_error)
    })?;

    Ok(HttpResponse::Ok().json(word))
}

pub async fn delete(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::delete(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "Word not found",
            ..Default::default()
        })
        .convert_db_to_http(db_error)
    })?;

    Ok(HttpResponse::Ok().finish())
}
