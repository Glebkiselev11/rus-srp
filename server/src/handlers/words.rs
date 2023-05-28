use crate::db;
use crate::models;
use crate::models::OptionalQuery;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn create(
    pool: web::Data<DbPool>,
    body: web::Json<models::NewWord>,
) -> actix_web::Result<impl Responder> {
    let word = models::NewWord {
        rus: body.rus.clone(),
        eng: body.eng.clone(),
        srp_latin: body.srp_latin.clone(),
        srp_cyrillic: body.srp_cyrillic.clone(),
    };

    // use web::block to offload blocking Diesel code without blocking server thread
    let word = web::block(move || {
        let mut conn = pool.get()?;
        db::words::insert(word, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(word))
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

    let words = web::block(move || {
        let mut conn = pool.get()?;
        db::words::select_all_with_filter(&mut conn, offset, search)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(models::Pagination {
        count: words.len(),
        offset,
        result: words,
    }))
}

pub async fn get_by_id(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    let words = web::block(move || {
        let mut conn = pool.get()?;
        db::words::select_by_id(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(words))
}

pub async fn update(
    pool: web::Data<DbPool>,
    body: web::Json<models::Word>,
) -> actix_web::Result<impl Responder> {
    let word = models::Word {
        id: body.id.clone(),
        rus: body.rus.clone(),
        eng: body.eng.clone(),
        srp_cyrillic: body.srp_cyrillic.clone(),
        srp_latin: body.srp_latin.clone(),
    };

    web::block(move || {
        let mut conn = pool.get()?;
        db::words::update(word, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(body))
}

pub async fn delete(
    pool: web::Data<DbPool>,
    id: web::Path<i32>,
) -> actix_web::Result<impl Responder> {
    web::block(move || {
        let mut conn = pool.get()?;
        db::words::delete(id.into_inner(), &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().finish())
}
