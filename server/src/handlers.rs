pub mod words {

    use crate::actions;
    use crate::models;
    use crate::models::OptionalQuery;
    use crate::DbPool;
    use actix_web::{web, HttpResponse, Responder, Result};

    pub async fn add_word(
        pool: web::Data<DbPool>,
        body: web::Json<models::NewWord>,
    ) -> Result<impl Responder> {
        let word = models::NewWord {
            rus: body.rus.clone(),
            srp_latin: body.srp_latin.clone(),
            srp_cyrillic: body.srp_cyrillic.clone(),
        };

        // use web::block to offload blocking Diesel code without blocking server thread
        let word = web::block(move || {
            let conn = pool.get()?;
            actions::insert_new_user(word, &conn)
        })
        .await?
        .map_err(actix_web::error::ErrorInternalServerError)?;

        Ok(HttpResponse::Ok().json(word))
    }

    pub async fn get_all_words(
        pool: web::Data<DbPool>,
        query: web::Query<OptionalQuery>,
    ) -> Result<impl Responder> {
        let offset = match query.offset {
            None => 0,
            Some(i) => i,
        };

        let words = web::block(move || {
            let conn = pool.get()?;
            actions::get_all_words(&conn, offset)
        })
        .await?
        .map_err(actix_web::error::ErrorInternalServerError)?;

        Ok(HttpResponse::Ok().json(models::Pagination {
            count: words.len(),
            offset,
            result: words,
        }))
    }

    pub async fn find_word_by_uid(
        pool: web::Data<DbPool>,
        id: web::Path<uuid::Uuid>,
    ) -> Result<impl Responder> {
        let words = web::block(move || {
            let conn = pool.get()?;
            actions::find_word_by_uid(id.into_inner(), &conn)
        })
        .await?
        .map_err(actix_web::error::ErrorInternalServerError)?;

        Ok(HttpResponse::Ok().json(words))
    }
}