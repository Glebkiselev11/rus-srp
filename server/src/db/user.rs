use crate::models::{NewUser, User};
use diesel::prelude::*;
use diesel::SqliteConnection;
type DbError = Box<dyn std::error::Error + Send + Sync>;
use uuid::Uuid;

pub fn add(new_user: NewUser, conn: &mut SqliteConnection) -> Result<User, DbError> {
    use crate::db::schema::users::dsl::*;

    let user = User {
        id: Uuid::new_v4().to_string(),
        username: new_user.username.clone(),
        password: new_user.password.clone(),
    };

    diesel::insert_into(users).values(&user).execute(conn)?;

    Ok(user)
}

pub fn find(_username: &str, conn: &mut SqliteConnection) -> Result<Option<User>, DbError> {
    use crate::db::schema::users::dsl::*;

    let user = users
        .filter(username.eq(_username))
        .first::<User>(conn)
        .optional()?;

    Ok(user)
}
