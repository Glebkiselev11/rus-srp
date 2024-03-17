use serde::{Deserialize, Serialize};

fn format(word: &str) -> String {
    word.to_lowercase()
}

#[derive(Debug, Deserialize)]
pub struct WordBody {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
    pub category_ids: Vec<i32>,
    pub translation_approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Word {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
    pub translation_approved: bool,
}

impl From<WordBody> for Word {
    fn from(body: WordBody) -> Self {
        Word {
            rus: format(&body.rus),
            srp_latin: format(&body.srp_latin),
            eng: format(&body.eng),
            srp_cyrillic: format(&body.srp_cyrillic),
            image: body.image,
            translation_approved: body.translation_approved,
        }
    }
}
