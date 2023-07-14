pub mod category;
pub mod pagination;
pub mod query_options;
pub mod user;
pub mod word;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub iss: String,
}

#[derive(Serialize, Deserialize)]
pub struct Token {
    pub token: String,
}
