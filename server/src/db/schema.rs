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
    }
}

diesel::table! {
    word_categories_words (id) {
        id -> Integer,
        word_id -> Integer,
        word_category_id -> Integer,
        created_at -> Timestamp,
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

diesel::allow_tables_to_appear_in_same_query!(
    categories,
    users,
    word_categories_words,
    words,
);
