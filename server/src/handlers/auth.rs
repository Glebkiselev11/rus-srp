use crate::db;
use crate::models::{Claims, NewUser, Token};
use crate::utils::hash::hash_password;
use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};
use bcrypt::verify;
use jsonwebtoken::{encode, EncodingKey, Header};
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
    let salted_password = hash_password(&body.password)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Failed to hash password"))?;

    let user = NewUser {
        username: body.username.clone(),
        password: salted_password,
    };

    let user = web::block(move || {
        let mut conn = pool.get()?;
        db::user::add(user, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(user))
}

pub async fn login(
    pool: web::Data<DbPool>,
    body: web::Json<NewUser>,
) -> actix_web::Result<impl Responder> {
    let password = body.password.clone();

    let user = web::block(move || {
        let mut conn = pool.get()?;
        db::user::select(&body.username, &mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    let unauthorized = Err(actix_web::error::ErrorUnauthorized("Unauthorized"));

    if let Some(u) = user {
        match verify(password, &u.password) {
            Ok(validated) => {
                if !validated {
                    return unauthorized;
                }
            }
            Err(e) => return Err(actix_web::error::ErrorInternalServerError(e)),
        }

        let claims = Claims {
            sub: u.username.clone(),
            iss: "localhost".into(),
        };
        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret("secret".as_ref()),
        )
        .unwrap();

        Ok(HttpResponse::Ok().json(Token { token }))
    } else {
        unauthorized
    }
}
