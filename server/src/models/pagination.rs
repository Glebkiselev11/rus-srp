use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Pagination<T> {
    pub offset: u32,
    pub count: usize,
    pub result: Vec<T>,
}
