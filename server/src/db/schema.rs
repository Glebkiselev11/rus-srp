// @generated automatically by Diesel CLI.

diesel::table! {
    categories (id) {
        id -> Int4,
        eng -> Varchar,
        rus -> Varchar,
        srp_latin -> Varchar,
        srp_cyrillic -> Varchar,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        image -> Nullable<Text>,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        password -> Varchar,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    words (id) {
        id -> Int4,
        eng -> Varchar,
        rus -> Varchar,
        srp_latin -> Varchar,
        srp_cyrillic -> Varchar,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        image -> Nullable<Text>,
        category_count -> Int4,
    }
}

diesel::table! {
    words_categories (word_id, category_id) {
        word_id -> Int4,
        category_id -> Int4,
        created_at -> Timestamp,
    }
}

diesel::joinable!(words_categories -> categories (category_id));
diesel::joinable!(words_categories -> words (word_id));

diesel::allow_tables_to_appear_in_same_query!(
    categories,
    users,
    words,
    words_categories,
);
