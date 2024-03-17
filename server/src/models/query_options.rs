use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct QueryOptions {
    pub offset: Option<i64>,
    pub search: Option<String>,
    pub limit: Option<i64>,
    pub order: Option<String>,
    pub category_id: Option<i32>,
    pub translation_approved_status: Option<String>,
}

impl QueryOptions {
    pub fn get_offset(&self) -> i64 {
        self.offset.unwrap_or(0)
    }

    pub fn get_limit(&self) -> i64 {
        self.limit.unwrap_or(20)
    }

    pub fn get_search(&self) -> String {
        let s = self.search.clone().unwrap_or_else(String::new);
        format!("%{}%", s.to_lowercase().trim())
    }

    pub fn get_order(&self) -> String {
        self.order.clone().unwrap_or_else(String::new)
    }

    pub fn must_exclude_approved_translations(&self) -> bool {
        match self.translation_approved_status.clone() {
            Some(s) => s == "exclude_approved",
            _ => false,
        }
    }
}
