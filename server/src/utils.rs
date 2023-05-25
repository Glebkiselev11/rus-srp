extern crate bcrypt;
use bcrypt::{hash, DEFAULT_COST};

pub fn hash_password(password: &str, salt: &str) -> Result<String, bcrypt::BcryptError> {
    let salted_password = format!("{}{}", password, salt);
    let hashed_password = hash(salted_password, DEFAULT_COST)?;
    Ok(hashed_password)
}
