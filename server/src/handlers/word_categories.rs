use crate::db;
use crate::models;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};

pub async fn add_cetogory(
    pool: web::Data<DbPool>,
    body: web::Json<models::NewWordCategory>,
) -> actix_web::Result<impl Responder> {
    let category = models::NewWordCategory {
        name: body.name.clone(),
        description: body.description.clone(),
    };

    let category = web::block(move || {
        let mut conn = pool.get()?;
        db::word_categories::add(category, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(category))
}
