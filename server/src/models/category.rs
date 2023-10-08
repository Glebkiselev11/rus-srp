use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryBody {
    pub eng: String,
    pub rus: Option<String>,
    pub srp_latin: Option<String>,
    pub srp_cyrillic: Option<String>,
    pub image: Option<String>,
}
