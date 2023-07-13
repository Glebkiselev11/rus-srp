use std::fmt;

pub type DbError = Box<dyn std::error::Error + Send + Sync>;

#[derive(Debug)]
pub struct RecordNotFoundError {
    message: &'static str,
}

impl RecordNotFoundError {
    pub fn new(message: &'static str) -> Self {
        Self { message }
    }
}

impl fmt::Display for RecordNotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for RecordNotFoundError {}
