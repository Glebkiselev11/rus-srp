use crate::models::{NewUser, User};
use diesel::prelude::*;
use diesel::SqliteConnection;
type DbError = Box<dyn std::error::Error + Send + Sync>;

pub fn add(new_user: NewUser, conn: &mut SqliteConnection) -> Result<User, DbError> {
    use crate::db::schema::users::dsl;

    let user = diesel::insert_into(dsl::users)
        .values(&new_user)
        .get_result::<User>(conn)?;

    Ok(user)
}

pub fn select(username: &str, conn: &mut SqliteConnection) -> Result<Option<User>, DbError> {
    use crate::db::schema::users::dsl;

    let user = dsl::users
        .filter(dsl::username.eq(username))
        .first::<User>(conn)
        .optional()?;

    Ok(user)
}
