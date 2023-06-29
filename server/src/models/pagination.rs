use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Pagination<T> {
    pub offset: i64,
    pub count: i64,
    pub result: Vec<T>,
}

#[derive(Debug, Serialize)]
pub struct DbQueryResult<T> {
    pub count: i64,
    pub result: Vec<T>,
}
