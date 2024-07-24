use std::collections::HashMap;

use crate::db::{
    categories::models::{DbCategory, DbCategoryWithWordsCount},
    error_type::DbError,
    schema,
    words::models::{DbWord, DbWordWithCategories},
    words_categories::models,
};
use diesel::prelude::*;

use super::models::DbWordCategory;

pub fn insert(
    category_id: i32,
    word_id: i32,
    conn: &mut PgConnection,
) -> Result<DbWordCategory, DbError> {
    use crate::db::schema::words_categories::dsl;

    let new_word_category_relation = models::DbNewWordCategory::new(category_id, word_id);

    let word_category_relation = diesel::insert_into(dsl::words_categories)
        .values(&new_word_category_relation)
        .get_result::<models::DbWordCategory>(conn)?;

    Ok(word_category_relation)
}

pub fn delete(category_id: i32, word_id: i32, conn: &mut PgConnection) -> Result<(), DbError> {
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
    conn: &mut PgConnection,
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
    conn: &mut PgConnection,
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

pub fn join_categories_with_words_count(
    categories: Vec<DbCategory>,
    conn: &mut PgConnection,
) -> Result<Vec<DbCategoryWithWordsCount>, DbError> {
    use crate::db::schema::words_categories::dsl;

    let category_ids: Vec<i32> = categories.iter().map(|c| c.id).collect();

    let links: Vec<DbWordCategory> = schema::words_categories::table
        .filter(dsl::category_id.eq_any(&category_ids))
        .load::<DbWordCategory>(conn)?;

    let count_map: HashMap<i32, i32> = links.into_iter().fold(HashMap::new(), |mut acc, link| {
        let count = acc.entry(link.category_id).or_insert(0);
        *count += 1;

        acc
    });

    let categories_with_words_count = categories
        .iter()
        .map(|cat| {
            DbCategoryWithWordsCount::new(cat.clone(), *count_map.get(&cat.id).unwrap_or(&0))
        })
        .collect();

    Ok(categories_with_words_count)
}

pub fn join_word_with_categories(
    word: DbWord,
    conn: &mut PgConnection,
) -> Result<DbWordWithCategories, DbError> {
    let categories = DbWordCategory::belonging_to(&word)
        .inner_join(schema::categories::table)
        .select(schema::categories::all_columns)
        .load::<DbCategory>(conn)
        .expect("Error on join_word_with_categories");

    Ok(DbWordWithCategories::new(word, categories))
}

pub fn join_words_with_categories(
    words: Vec<DbWord>,
    conn: &mut PgConnection,
) -> Result<Vec<DbWordWithCategories>, DbError> {
    use crate::db::schema::words_categories::dsl;

    let word_ids: Vec<i32> = words.iter().map(|word| word.id).collect();

    let category_links: Vec<DbWordCategory> = schema::words_categories::table
        .filter(dsl::word_id.eq_any(&word_ids))
        .load::<DbWordCategory>(conn)?;

    let category_ids: Vec<i32> = category_links.iter().map(|x| x.category_id).collect();

    let categories = schema::categories::table
        .filter(schema::categories::dsl::id.eq_any(&category_ids))
        .load::<DbCategory>(conn)?;

    let category_map: HashMap<i32, DbCategory> =
        categories.into_iter().map(|cat| (cat.id, cat)).collect();

    let words_with_categories = words
        .into_iter()
        .map(|word| {
            let categories = category_links
                .iter()
                .filter_map(|x| {
                    if x.word_id == word.id {
                        category_map.get(&x.category_id).cloned()
                    } else {
                        None
                    }
                })
                .collect::<Vec<DbCategory>>();
            DbWordWithCategories::new(word, categories)
        })
        .collect::<Vec<DbWordWithCategories>>();

    Ok(words_with_categories)
}
