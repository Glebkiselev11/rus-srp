// @generated automatically by Diesel CLI.

diesel::table! {
    categories (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        username -> Text,
        password -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    words (id) {
        id -> Integer,
        rus -> Text,
        eng -> Text,
        srp_latin -> Text,
        srp_cyrillic -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        image -> Nullable<Text>,
    }
}

diesel::table! {
    words_categories (word_id, category_id) {
        word_id -> Integer,
        category_id -> Integer,
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
