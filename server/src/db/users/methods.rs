use super::models::{DbNewUser, DbUser};
use crate::db::models::DbError;
use diesel::prelude::*;
use diesel::SqliteConnection;

pub fn add(new_user: DbNewUser, conn: &mut SqliteConnection) -> Result<DbUser, DbError> {
    use crate::db::schema::users::dsl;

    let user = diesel::insert_into(dsl::users)
        .values(&new_user)
        .get_result::<DbUser>(conn)?;

    Ok(user)
}

pub fn select(username: &str, conn: &mut SqliteConnection) -> Result<Option<DbUser>, DbError> {
    use crate::db::schema::users::dsl;

    let user = dsl::users
        .filter(dsl::username.eq(username))
        .first::<DbUser>(conn)
        .optional()?;

    Ok(user)
}
