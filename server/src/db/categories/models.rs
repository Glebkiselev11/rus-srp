use crate::{
    db::schema::categories,
    models::category::{CategoryBody, NewCategory},
};
use chrono;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = categories)]
pub struct DbNewCategory {
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub image: Option<String>,
}

impl From<NewCategory> for DbNewCategory {
    fn from(category: NewCategory) -> Self {
        DbNewCategory {
            eng: category.eng,
            rus: category.rus,
            srp_latin: category.srp_latin,
            srp_cyrillic: category.srp_cyrillic,
            image: category.image,
            created_at: chrono::Utc::now().naive_utc(),
        }
    }
}

// When you add new fields to the DbCategory struct,
// make sure they are in the same order as in the diesel::table scheme.
#[derive(
    Debug,
    Clone,
    Serialize,
    Deserialize,
    Queryable,
    AsChangeset,
    Selectable,
    PartialEq,
    Identifiable,
)]
#[diesel(table_name = categories)]
pub struct DbCategory {
    pub id: i32,
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbCategoryWithWordsCount {
    pub id: i32,
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub image: Option<String>,
    pub words_count: i64,
}

impl DbCategoryWithWordsCount {
    pub fn new(category: DbCategory, words_count: i64) -> Self {
        DbCategoryWithWordsCount {
            id: category.id,
            eng: category.eng,
            rus: category.rus,
            srp_latin: category.srp_latin,
            srp_cyrillic: category.srp_cyrillic,
            created_at: category.created_at,
            updated_at: category.updated_at,
            image: category.image,
            words_count,
        }
    }
}
