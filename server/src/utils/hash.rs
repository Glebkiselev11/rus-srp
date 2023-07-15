extern crate bcrypt;
use bcrypt::{hash_with_salt, DEFAULT_COST};

pub fn hash_password(password: String) -> Result<String, bcrypt::BcryptError> {
    let chars_salt: Vec<char> = std::env::var("SALT")
        .expect("Password SALT env")
        .chars()
        .collect();

    let mut salt: [u8; 16] = [0; 16];
    for i in 0..16 {
        // Here doesn't matter how long or short salt from env was
        salt[i] = chars_salt[i % chars_salt.len()] as u8;
    }

    let hashed_password = hash_with_salt(password, DEFAULT_COST, salt)?;

    Ok(hashed_password.to_string())
}
