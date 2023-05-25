use crate::db;
use crate::models::NewUser;
use crate::utils::hash_password;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct RegisterInfo {
    pub username: String,
    pub password: String,
}

pub async fn register(
    pool: web::Data<DbPool>,
    body: web::Json<RegisterInfo>,
) -> actix_web::Result<impl Responder> {
    let salt = std::env::var("SALT").expect("Password SALT env");
    let password = match hash_password(&body.password, &salt) {
        Ok(x) => x,
        Err(_) => {
            return Err(actix_web::error::ErrorInternalServerError(
                "Failed to hash password",
            ));
        }
    };

    let user = NewUser {
        username: body.username.clone(),
        password,
    };

    let user = web::block(move || {
        let conn = pool.get()?;
        db::user::register(user, &conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(user))
}
