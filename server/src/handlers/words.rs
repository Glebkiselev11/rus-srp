use super::custom_http_error::{CustomHttpError, ErrorMessagesBuilder};
use crate::db;
use crate::db::error_type::DbError;
use crate::models::pagination::Pagination;
use crate::models::query_options::QueryOptions;
use crate::models::word::{Word, WordBody};
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<db::PgPool>,
    body: web::Json<WordBody>,
) -> actix_web::Result<impl Responder> {
    let category_ids = body.category_ids.clone();
    let new_word = Word::from(body.into_inner());

    // use web::block to offload blocking Diesel code without blocking server thread
    let word = web::block(move || {
        let mut conn = pool.get()?;

        let word_result = db::words::methods::insert(new_word, &mut conn);

        // Insert word into each category
        if let Ok(w) = &word_result {
            for category_id in &category_ids {
                db::words_categories::methods::insert(*category_id, w.id, &mut conn)?;
            }

            if category_ids.len() > 0 {
                return db::words::methods::select_by_id(w.id, &mut conn);
            }
        }

        word_result
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(word))
}

pub async fn get_list_by_query(
    pool: web::Data<db::PgPool>,
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

pub async fn get_count_by_query(
    pool: web::Data<db::PgPool>,
    query: web::Query<QueryOptions>,
) -> actix_web::Result<impl Responder> {
    let query = query.into_inner();

    let count = web::block(move || {
        let mut conn = pool.get()?;
        db::words::methods::select_count_with_filter(&mut conn, query)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(count))
}

pub async fn get_by_id(
    pool: web::Data<db::PgPool>,
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
    pool: web::Data<db::PgPool>,
    id: web::Path<i32>,
    body: web::Json<WordBody>,
) -> actix_web::Result<impl Responder> {
    let category_ids = body.category_ids.clone();

    let word = Word::from(body.into_inner());
    let id = id.into_inner();

    let word = web::block(move || {
        let mut conn = pool.get()?;

        db::words_categories::methods::sync_categories_with_word(&category_ids, id, &mut conn)?;
        db::words::methods::update(word, id, &mut conn)
    })
    .await?
    .map_err(_convert_db_error_to_http_error)?;

    Ok(HttpResponse::Ok().json(word))
}

pub async fn delete(
    pool: web::Data<db::PgPool>,
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
