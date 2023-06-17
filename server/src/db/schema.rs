// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Integer,
        username -> Text,
        password -> Text,
    }
}

diesel::table! {
    word_categories (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
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
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    users,
    word_categories,
    words,
);
