use crate::db::schema::users;
use crate::utils::hash::hash_password;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct UserBody {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Insertable)]
#[diesel(table_name = users)]
pub struct DbNewUser {
    pub username: String,
    pub password: String,
}

impl TryFrom<UserBody> for DbNewUser {
    type Error = bcrypt::BcryptError;

    fn try_from(u: UserBody) -> Result<Self, Self::Error> {
        match hash_password(&u.password) {
            Ok(salted_password) => Ok(DbNewUser {
                username: u.username,
                password: salted_password,
            }),
            Err(e) => Err(e),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, AsChangeset)]
#[diesel(table_name = users)]
pub struct DbUser {
    pub id: i32,
    pub username: String,
    pub password: String,
}
