use serde::{Deserialize, Serialize};

use crate::schema::words;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
pub struct Word {
    pub id: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewWord {
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
}

#[derive(Debug, Serialize)]
pub struct Pagination<T> {
    pub offset: u32,
    pub count: usize,
    pub result: Vec<T>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OptionalQuery {
    pub offset: Option<u32>,
}
