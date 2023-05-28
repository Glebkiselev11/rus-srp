use chrono;
use serde::{Deserialize, Serialize};

use crate::db::schema::{users, word_categories, words};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewWord {
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub eng: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable, AsChangeset)]
pub struct Word {
    pub id: String,
    pub rus: String,
    pub eng: String,
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
    pub search: Option<String>,
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable, AsChangeset)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub password: String,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewWordCategory {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Insertable)]
#[diesel(table_name = word_categories)]
pub struct NewWordCategoryWithCreationDate {
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = word_categories)]
pub struct WordCategory {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
