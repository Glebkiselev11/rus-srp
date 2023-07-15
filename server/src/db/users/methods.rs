use super::models::{DbNewUser, DbUser};
use crate::db::models::DbError;
use crate::db::models::RecordNotFoundError;
use diesel::prelude::*;
use diesel::SqliteConnection;

pub fn add(
    username: String,
    salted_password: String,
    conn: &mut SqliteConnection,
) -> Result<DbUser, DbError> {
    use crate::db::schema::users::dsl;

    let new_user = DbNewUser::new(username, salted_password);

    let user = diesel::insert_into(dsl::users)
        .values(&new_user)
        .get_result::<DbUser>(conn)?;

    Ok(user)
}

pub fn select(username: &str, conn: &mut SqliteConnection) -> Result<DbUser, DbError> {
    use crate::db::schema::users::dsl;

    let user = dsl::users
        .filter(dsl::username.eq(username))
        .first::<DbUser>(conn)
        .optional()?
        .ok_or(RecordNotFoundError::new(
            "User with this username doesn't exist",
        ))?;

    Ok(user)
}
