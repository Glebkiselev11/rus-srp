use crate::models::word::NewWord;
use crate::{db::schema::words, models::word::UpdateWordBody};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = words)]
pub struct DbNewWord {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub image: Option<String>,
}

impl From<NewWord> for DbNewWord {
    fn from(new_word: NewWord) -> Self {
        DbNewWord {
            rus: new_word.rus,
            srp_latin: new_word.srp_latin,
            srp_cyrillic: new_word.srp_cyrillic,
            eng: new_word.eng,
            created_at: chrono::Utc::now().naive_utc(),
            image: new_word.image,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = words)]
pub struct DbWord {
    pub id: i32,
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub image: Option<String>,
}

impl DbWord {
    pub fn with_update(&self, payload: UpdateWordBody) -> DbWord {
        DbWord {
            id: self.id,
            created_at: self.created_at,
            rus: payload.rus,
            eng: payload.eng,
            srp_latin: payload.srp_latin,
            srp_cyrillic: payload.srp_cyrillic,
            updated_at: Some(chrono::Utc::now().naive_utc()),
            image: payload.image,
        }
    }
}
