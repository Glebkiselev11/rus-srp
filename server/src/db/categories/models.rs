use crate::{db::schema::categories, models::category::CategoryBody};
use chrono;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = categories)]
pub struct DbNewCategory {
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

impl From<CategoryBody> for DbNewCategory {
    fn from(category: CategoryBody) -> Self {
        DbNewCategory {
            name: category.name,
            description: category.description,
            created_at: chrono::Utc::now().naive_utc(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = categories)]
pub struct DbCategory {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

impl DbCategory {
    pub fn with_update(&self, payload: CategoryBody) -> DbCategory {
        DbCategory {
            id: self.id,
            created_at: self.created_at,
            name: payload.name,
            description: payload.description,
            updated_at: Some(chrono::Utc::now().naive_utc()),
        }
    }
}
