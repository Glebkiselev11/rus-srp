use crate::db::{error_type::DbError, words_categories::models};
use diesel::prelude::*;

use super::models::DbWordCategory;

pub fn insert(
    category_id: i32,
    word_id: i32,
    conn: &mut SqliteConnection,
) -> Result<DbWordCategory, DbError> {
    use crate::db::schema::words_categories::dsl;

    let new_word_category_relation = models::DbNewWordCategory::new(category_id, word_id);

    let word_category_relation = diesel::insert_into(dsl::words_categories)
        .values(&new_word_category_relation)
        .get_result::<models::DbWordCategory>(conn)?;

    Ok(word_category_relation)
}

pub fn delete(category_id: i32, word_id: i32, conn: &mut SqliteConnection) -> Result<(), DbError> {
    use crate::db::schema::words_categories::dsl;

    let deleted_rows = diesel::delete(
        dsl::words_categories
            .filter(dsl::category_id.eq(category_id))
            .filter(dsl::word_id.eq(word_id)),
    )
    .execute(conn)?;

    if deleted_rows == 0 {
        return Err(diesel::result::Error::NotFound.into());
    }

    Ok(())
}

pub fn get_words_ids_by_category_id(
    category_id: i32,
    conn: &mut SqliteConnection,
) -> Result<Vec<i32>, DbError> {
    use crate::db::schema::words_categories::dsl;

    let relations: Vec<DbWordCategory> = dsl::words_categories
        .filter(dsl::category_id.eq(category_id))
        .load::<DbWordCategory>(conn)?;

    Ok(relations.iter().map(|r| r.word_id).collect())
}

pub fn sync_categories_with_word(
    category_ids: &[i32],
    word_id: i32,
    conn: &mut SqliteConnection,
) -> Result<(), DbError> {
    use crate::db::schema::words_categories::dsl;

    let current_categories_ids: Vec<i32> = dsl::words_categories
        .filter(dsl::word_id.eq(word_id))
        .select(dsl::category_id)
        .load::<i32>(conn)?;

    let categories_to_add: Vec<i32> = category_ids
        .iter()
        .filter(|id| !current_categories_ids.contains(id))
        .map(|id| *id)
        .collect();

    let categories_to_delete: Vec<i32> = current_categories_ids
        .iter()
        .filter(|id| !category_ids.contains(id))
        .map(|id| *id)
        .collect();

    for category_id in categories_to_add {
        insert(category_id, word_id, conn)?;
    }

    for category_id in categories_to_delete {
        delete(category_id, word_id, conn)?;
    }

    Ok(())
}
