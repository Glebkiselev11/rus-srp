use crate::db;
use crate::models::user::UserBody;
use crate::models::{Claims, Token};
use crate::utils::hash::hash_password;

use super::custom_http_error::{CustomHttpError, ErrorMessagesBuilder};

use crate::DbPool;
use actix_web::{web, HttpResponse, Responder};
use bcrypt::verify;
use jsonwebtoken::{encode, EncodingKey, Header};

pub async fn register(
    pool: web::Data<DbPool>,
    body: web::Json<UserBody>,
) -> actix_web::Result<impl Responder> {
    let username = body.username.clone();
    let salted_password = match hash_password(body.password.clone()) {
        Ok(p) => p,
        Err(_) => {
            return Err(actix_web::error::ErrorInternalServerError(
                "Failed to hash password",
            ))
        }
    };

    let registered_user = web::block(move || {
        let mut conn = pool.get()?;
        db::users::methods::add(username, salted_password, &mut conn)
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            unique_violation: "User already exists",
            ..Default::default()
        })
        .convert_db_error_to_http_error(db_error)
    })?;

    Ok(HttpResponse::Ok().json(registered_user))
}

pub async fn login(
    pool: web::Data<DbPool>,
    body: web::Json<UserBody>,
) -> actix_web::Result<impl Responder> {
    let password = body.password.clone();

    let user = web::block(move || {
        let mut conn = pool.get()?;
        db::users::methods::select(&body.username, &mut conn)
    })
    .await?
    .map_err(|db_error| {
        CustomHttpError::new(ErrorMessagesBuilder {
            not_found: "User with this username that you provided doesn't exist",
            ..Default::default()
        })
        .convert_db_error_to_http_error(db_error)
    })?;

    match verify(password, &user.password) {
        Ok(validated) => {
            if !validated {
                return Err(actix_web::error::ErrorUnauthorized("Password is incorrect"));
            }
        }
        Err(e) => return Err(actix_web::error::ErrorInternalServerError(e)),
    }

    let claims = Claims {
        sub: user.username.clone(),
        iss: "localhost".into(),
    };
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret("secret".as_ref()),
    )
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(Token { token }))
}
