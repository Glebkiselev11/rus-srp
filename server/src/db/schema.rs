// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Nullable<Text>,
        username -> Text,
        password -> Text,
    }
}

diesel::table! {
    words (id) {
        id -> Text,
        rus -> Text,
        eng -> Text,
        srp_latin -> Text,
        srp_cyrillic -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    users,
    words,
);
