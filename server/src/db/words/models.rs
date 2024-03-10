use crate::db::{categories::models::DbCategory, schema::words};
use crate::models::word::Word;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = words)]
pub struct DbNewWord {
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub image: Option<String>,
}

impl From<Word> for DbNewWord {
    fn from(new_word: Word) -> Self {
        DbNewWord {
            eng: new_word.eng,
            rus: new_word.rus,
            srp_latin: new_word.srp_latin,
            srp_cyrillic: new_word.srp_cyrillic,
            created_at: chrono::Utc::now().naive_utc(),
            image: new_word.image,
        }
    }
}

#[derive(
    Debug,
    Clone,
    Serialize,
    Deserialize,
    Queryable,
    AsChangeset,
    Identifiable,
    Selectable,
    PartialEq,
)]
#[diesel(table_name = words)]
pub struct DbWord {
    pub id: i32,
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub image: Option<String>,
    pub category_count: i32,
}

impl DbWord {
    pub fn with_update(&self, payload: Word) -> DbWord {
        DbWord {
            id: self.id,
            created_at: self.created_at,
            rus: payload.rus,
            eng: payload.eng,
            srp_latin: payload.srp_latin,
            srp_cyrillic: payload.srp_cyrillic,
            updated_at: Some(chrono::Utc::now().naive_utc()),
            image: payload.image,
            category_count: self.category_count,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbWordWithCategories {
    pub id: i32,
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub image: Option<String>,
    pub categories: Vec<DbCategory>,
}

impl DbWordWithCategories {
    pub fn new(word: DbWord, categories: Vec<DbCategory>) -> Self {
        DbWordWithCategories {
            id: word.id,
            rus: word.rus,
            eng: word.eng,
            srp_latin: word.srp_latin,
            srp_cyrillic: word.srp_cyrillic,
            created_at: word.created_at,
            updated_at: word.updated_at,
            image: word.image,
            categories,
        }
    }

    pub fn to_dbword(&self) -> DbWord {
        DbWord {
            id: self.id,
            rus: self.rus.clone(),
            eng: self.eng.clone(),
            srp_latin: self.srp_latin.clone(),
            srp_cyrillic: self.srp_cyrillic.clone(),
            created_at: self.created_at,
            updated_at: self.updated_at,
            image: self.image.clone(),
            category_count: self.categories.len() as i32,
        }
    }
}
