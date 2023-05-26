extern crate bcrypt;
use bcrypt::{hash, DEFAULT_COST};

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    let salt = std::env::var("SALT").expect("Password SALT env");

    let salted_password = format!("{}{}", password, salt);
    let hashed_password = hash(salted_password, DEFAULT_COST)?;
    Ok(hashed_password)
}
