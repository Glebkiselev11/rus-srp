pub mod word;

use chrono;
use serde::{Deserialize, Serialize};

use crate::db::schema::{users, word_categories};

#[derive(Debug, Serialize)]
pub struct Pagination<T> {
    pub offset: u32,
    pub count: usize,
    pub result: Vec<T>,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Order {
    Asc,
    Desc,
}

impl Default for Order {
    fn default() -> Self {
        Order::Asc
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct OptionalQuery {
    pub offset: Option<u32>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub order: Option<Order>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable, AsChangeset)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Insertable)]
#[diesel(table_name = users)]
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
