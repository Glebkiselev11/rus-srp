use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct NewWordBody {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewWord {
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub eng: String,
    pub image: Option<String>,
}

impl From<NewWordBody> for NewWord {
    fn from(body: NewWordBody) -> Self {
        let format = |w: &str| w.to_lowercase();

        NewWord {
            rus: format(&body.rus),
            srp_latin: format(&body.srp_latin),
            eng: format(&body.eng),
            srp_cyrillic: format(&body.srp_cyrillic),
            image: body.image,
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateWordBody {
    pub id: i32,
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
}
