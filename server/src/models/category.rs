use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryBody {
    pub eng: String,
    pub rus: String,
    pub srp_latin: String,
    pub srp_cyrillic: String,
    pub image: Option<String>,
}
