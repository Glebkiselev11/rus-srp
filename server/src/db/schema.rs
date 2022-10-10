// @generated automatically by Diesel CLI.

diesel::table! {
    words (id) {
        id -> Text,
        rus -> Text,
        eng -> Text,
        srp_latin -> Text,
        srp_cyrillic -> Text,
    }
}
