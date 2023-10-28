use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct NewCategoryBody {
    pub rus: String,
    pub eng: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewCategory {
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub eng: String,
    pub image: Option<String>,
}

impl From<NewCategoryBody> for NewCategory {
    fn from(body: NewCategoryBody) -> Self {
        let format = |w: &str| w.to_lowercase();

        NewCategory {
            rus: format(&body.rus),
            srp_latin: format(&body.srp_latin),
            eng: format(&body.eng),
            srp_cyrillic: format(&body.srp_cyrillic),
            image: body.image,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryBody {
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
}
