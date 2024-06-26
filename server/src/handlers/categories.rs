use crate::db::error_type::DbError;
use crate::models::category::{CategoryBody, CategoryWordsBody, NewCategory};
use crate::models::pagination::Pagination;
use crate::models::query_options::QueryOptions;
use crate::{db, models::category::NewCategoryBody};
use actix_web::{web, HttpResponse, Responder};

use super::custom_http_error::{CustomHttpError, ErrorMessagesBuilder};

pub async fn create(
    pool: web::Data<db::PgPool>,
    body: web::Json<NewCategoryBody>,
) -> actix_web::Result<impl Responder> {
    let new_category = NewCategory::from(body.into_inner());

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::methods::insert(new_category, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(category))
}

pub async fn get_by_id(
    pool: web::Data<db::PgPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::methods::select_by_id(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(_convert_db_error_to_http_error)?;

    Ok(HttpResponse::Ok().json(category))
}

pub async fn get_list_by_query(
    pool: web::Data<db::PgPool>,
    query: web::Query<QueryOptions>,
) -> actix_web::Result<impl Responder> {
    let query = query.into_inner();
    let offset = query.get_offset();

    let db_guery_result = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::methods::select_all_with_filter(&mut conn, query)
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
    pool: web::Data<db::PgPool>,
    id: web::Path<i32>,
    body: web::Json<CategoryBody>,
) -> actix_web::Result<impl Responder> {
    let category = body.into_inner();

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::categories::methods::update(category, id.into_inner(), &mut conn)
    })
    .await?
    .map_err(_convert_db_error_to_http_error)?;

    match category {
        Some(x) => Ok(HttpResponse::Ok().json(x)),
        None => Ok(HttpResponse::NotFound().body("Category not found")),
    }
}

pub async fn delete(
    pool: web::Data<db::PgPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    web::block(move || {
        let mut conn = pool.get()?;
        db::categories::methods::delete(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(_convert_db_error_to_http_error)?;

    Ok(HttpResponse::Ok().finish())
}

pub async fn add_words(
    pool: web::Data<db::PgPool>,
    category_id: web::Path<i32>,
    body: web::Json<CategoryWordsBody>,
) -> actix_web::Result<impl Responder> {
    let word_ids = body.into_inner().word_ids;
    let category_id = category_id.into_inner();

    let word_category_relation = web::block(move || {
        let mut conn = pool.get()?;

        // Check if category exists
        db::categories::methods::select_by_id(category_id, &mut conn)?;

        word_ids
            .iter()
            .map(|word_id| {
                // Check if word exists
                db::words::methods::select_by_id(*word_id, &mut conn)?;
                db::words_categories::methods::insert(category_id, *word_id, &mut conn)
            })
            .collect::<Result<Vec<_>, _>>()
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "Category or word not found",
            unique_violation: "Word already exists in category",
        })
        .convert_db_error_to_http_error(db_error)
    })?;

    Ok(HttpResponse::Ok().json(word_category_relation))
}

pub async fn delete_words(
    pool: web::Data<db::PgPool>,
    path: web::Path<i32>,
    body: web::Json<CategoryWordsBody>,
) -> actix_web::Result<impl Responder> {
    let category_id = path.into_inner();
    let word_ids = body.into_inner().word_ids;

    web::block(move || {
        let mut conn = pool.get()?;

        word_ids
            .iter()
            .map(|word_id| db::words_categories::methods::delete(category_id, *word_id, &mut conn))
            .collect::<Result<Vec<_>, _>>()
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "Relationship between category and the word you provided not found",
            ..Default::default()
        })
        .convert_db_error_to_http_error(db_error)
    })?;

    Ok(HttpResponse::Ok().finish())
}

fn _convert_db_error_to_http_error(e: DbError) -> actix_web::Error {
    CustomHttpError::new(ErrorMessagesBuilder {
        not_found: "Category not found",
        ..Default::default()
    })
    .convert_db_error_to_http_error(e)
}
