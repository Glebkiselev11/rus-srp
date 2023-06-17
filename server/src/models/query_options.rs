use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct QueryOptions {
    pub offset: Option<u32>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub order: Option<String>,
}
