use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct QueryOptions {
    pub offset: Option<u32>,
    pub search: Option<String>,
    pub limit: Option<u32>,
    pub order: Option<String>,
}

impl QueryOptions {
    pub fn get_offset(&self) -> u32 {
        self.offset.unwrap_or(0)
    }

    pub fn get_search(&self) -> String {
        self.search
            .as_ref()
            .map(|s| format!("%{}%", s.to_lowercase()))
            .unwrap_or_else(String::new)
    }
}