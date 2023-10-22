use crate::db::categories::models::DbCategory;
use crate::db::schema::words_categories;
use crate::db::words::models::DbWord;
use chrono::Utc;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = words_categories)]
pub struct DbNewWordCategory {
    pub word_id: i32,
    pub category_id: i32,
    pub created_at: chrono::NaiveDateTime,
}

impl DbNewWordCategory {
    pub fn new(category_id: i32, word_id: i32) -> Self {
        DbNewWordCategory {
            word_id,
            category_id,
            created_at: Utc::now().naive_utc(),
        }
    }
}

#[derive(
    Identifiable,
    Debug,
    Clone,
    Serialize,
    Deserialize,
    Selectable,
    Associations,
    Queryable,
    AsChangeset,
)]
#[diesel(belongs_to(DbWord, foreign_key = word_id))]
#[diesel(belongs_to(DbCategory, foreign_key = category_id))]
#[diesel(table_name = words_categories)]
#[diesel(primary_key(word_id, category_id))]
pub struct DbWordCategory {
    pub word_id: i32,
    pub category_id: i32,
    pub created_at: chrono::NaiveDateTime,
}
