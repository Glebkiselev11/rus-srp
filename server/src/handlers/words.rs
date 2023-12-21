use super::custom_http_error::{CustomHttpError, ErrorMessagesBuilder};
use crate::db;
use crate::db::error_type::DbError;
use crate::models::pagination::Pagination;
use crate::models::query_options::QueryOptions;
use crate::models::word::{Word, WordBody};
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<WordBody>,
) -> actix_web::Result<impl Responder> {
    let category_ids = body.added_category_ids.clone();
    let new_word = Word::from(body.into_inner());

    // use web::block to offload blocking Diesel code without blocking server thread
    let word = web::block(move || {
        let mut conn = pool.get()?;

        let word = db::words::methods::insert(new_word, &mut conn);

        // Insert word into each category
        if let Ok(w) = &word {
            for category_id in &category_ids {
                db::words_categories::methods::insert(*category_id, w.id, &mut conn)?;
            }
        }

        word
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
    .map_err(_convert_db_error_to_http_error)?;

    Ok(HttpResponse::Ok().json(words))
}

pub async fn update(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
    body: web::Json<WordBody>,
) -> actix_web::Result<impl Responder> {
    let added_category_ids = body.added_category_ids.clone();
    let removed_category_ids = body.removed_category_ids.clone();

    let word = Word::from(body.into_inner());
    let id = id.into_inner();

    let word = web::block(move || {
        let mut conn = pool.get()?;

        for category_id in &added_category_ids {
            db::words_categories::methods::insert(*category_id, id, &mut conn)?;
        }

        for category_id in &removed_category_ids {
            db::words_categories::methods::delete(*category_id, id, &mut conn)?;
        }

        db::words::methods::update(word, id, &mut conn)
    })
    .await?
    .map_err(_convert_db_error_to_http_error)?;

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
    .map_err(_convert_db_error_to_http_error)?;

    Ok(HttpResponse::Ok().finish())
}

fn _convert_db_error_to_http_error(e: DbError) -> actix_web::Error {
    CustomHttpError::new(ErrorMessagesBuilder {
        not_found: "Word not found",
        ..Default::default()
    })
    .convert_db_error_to_http_error(e)
}
