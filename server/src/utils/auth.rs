use crate::models::Claims;
use actix_web::{dev::ServiceRequest, error, Error};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

pub async fn validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let validation = Validation::new(Algorithm::default());
    let secret = std::env::var("AUTH_SECRET").expect("AUTH_SECRET env");

    match decode::<Claims>(
        credentials.token(),
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    ) {
        Ok(_) => return Ok(req),
        Err(e) => return Err((error::ErrorUnauthorized(e), req)),
    }
}
