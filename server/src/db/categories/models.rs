use crate::{db::schema::categories, models::category::CategoryBody};
use chrono;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = categories)]
pub struct DbNewCategory {
    pub eng: String,
    pub rus: Option<String>,
    pub srp_latin: Option<String>,
    pub srp_cyrillic: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub image: Option<String>,
}

impl From<CategoryBody> for DbNewCategory {
    fn from(category: CategoryBody) -> Self {
        DbNewCategory {
            eng: category.eng,
            rus: category.rus,
            srp_cyrillic: category.srp_cyrillic,
            srp_latin: category.srp_latin,
            image: category.image,
            created_at: chrono::Utc::now().naive_utc(),
        }
    }
}

// When you add new fields to the DbCategory struct,
// make sure they are in the same order as in the diesel::table scheme.
#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = categories)]
pub struct DbCategory {
    pub id: i32,
    pub eng: String,
    pub rus: Option<String>,
    pub srp_latin: Option<String>,
    pub srp_cyrillic: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub image: Option<String>,
}

impl DbCategory {
    pub fn with_update(&self, payload: CategoryBody) -> DbCategory {
        DbCategory {
            id: self.id,
            created_at: self.created_at,
            eng: payload.eng,
            rus: payload.rus,
            srp_cyrillic: payload.srp_cyrillic,
            srp_latin: payload.srp_latin,
            image: payload.image,
            updated_at: Some(chrono::Utc::now().naive_utc()),
        }
    }
}
