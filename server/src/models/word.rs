use crate::db::schema::words;
use crate::utils::translate::SerbianCyrillic;
use actix_web::web::Json;
use chrono;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct NewWordBody {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Insertable)]
#[diesel(table_name = words)]
pub struct NewWord {
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub eng: String,
}

impl From<Json<NewWordBody>> for NewWord {
    fn from(data: Json<NewWordBody>) -> Self {
        let format = |w: &str| w.to_lowercase();

        NewWord {
            rus: format(&data.rus),
            srp_latin: format(&data.srp_latin),
            eng: format(&data.eng),
            srp_cyrillic: format(&SerbianCyrillic::from_latin(&data.srp_latin)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = words)]
pub struct DbNewWord {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub created_at: chrono::NaiveDateTime,
}

impl From<NewWord> for DbNewWord {
    fn from(new_word: NewWord) -> Self {
        DbNewWord {
            rus: new_word.rus,
            srp_latin: new_word.srp_latin,
            srp_cyrillic: new_word.srp_cyrillic,
            eng: new_word.eng,
            created_at: chrono::Utc::now().naive_utc(),
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
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateWordBody {
    pub id: i32,
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
}
