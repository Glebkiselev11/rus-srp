use crate::db;
use crate::models::user::UserBody;
use crate::models::{Claims, Token};
use crate::utils::hash::hash_password;

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
    .map_err(actix_web::error::ErrorInternalServerError)?;

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
