use crate::db::schema::words_categories;
use chrono::Utc;
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

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = words_categories)]
pub struct DbWordCategory {
    pub id: i32,
    pub word_id: i32,
    pub category_id: i32,
    pub created_at: chrono::NaiveDateTime,
}
