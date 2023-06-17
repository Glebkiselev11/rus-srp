use crate::db::schema::word_categories;
use chrono;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordCategoryBody {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = word_categories)]
pub struct DbNewWordCategory {
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

impl From<WordCategoryBody> for DbNewWordCategory {
    fn from(category: WordCategoryBody) -> Self {
        DbNewWordCategory {
            name: category.name,
            description: category.description,
            created_at: chrono::Utc::now().naive_utc(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = word_categories)]
pub struct DbWordCategory {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

impl DbWordCategory {
    pub fn with_update(&self, payload: WordCategoryBody) -> DbWordCategory {
        DbWordCategory {
            id: self.id,
            created_at: self.created_at,
            name: payload.name,
            description: payload.description,
            updated_at: Some(chrono::Utc::now().naive_utc()),
        }
    }
}
