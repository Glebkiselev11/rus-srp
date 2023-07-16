use crate::db::schema::users;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Insertable)]
#[diesel(table_name = users)]
pub struct DbNewUser {
    pub username: String,
    pub password: String,
    pub created_at: chrono::NaiveDateTime,
}

impl DbNewUser {
    pub fn new(username: String, password: String) -> DbNewUser {
        DbNewUser {
            username,
            password,
            created_at: chrono::Utc::now().naive_local(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = users)]
pub struct DbUser {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
