pub mod user;
pub mod word;
pub mod word_category;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct Pagination<T> {
    pub offset: u32,
    pub count: usize,
    pub result: Vec<T>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OptionalQuery {
    pub offset: Option<u32>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub order: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub iss: String,
}

#[derive(Serialize, Deserialize)]
pub struct Token {
    pub token: String,
}
