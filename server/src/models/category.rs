use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryBody {
    pub name: String,
    pub description: Option<String>,
}
