use crate::db::error_type::DbError;
use actix_web::error as http;
use actix_web::Error as HttpError;
use diesel::result::DatabaseErrorKind;
use diesel::result::Error as DieselError;

pub struct ErrorMessagesBuilder {
    pub not_found: &'static str,
    pub unique_violation: &'static str,
}

impl Default for ErrorMessagesBuilder {
    fn default() -> Self {
        Self {
            not_found: "Not found",
            unique_violation: "Unique violation",
        }
    }
}

pub struct CustomHttpError {
    pub not_found: &'static str,
    pub unique_violation: &'static str,
}

impl CustomHttpError {
    pub fn new(builder: ErrorMessagesBuilder) -> Self {
        Self {
            not_found: builder.not_found,
            unique_violation: builder.unique_violation,
        }
    }

    pub fn convert_db_to_http(&self, e: DbError) -> HttpError {
        if let Some(result_error) = e.downcast_ref::<DieselError>() {
            match *result_error {
                DieselError::NotFound => http::ErrorNotFound(self.not_found),
                DieselError::DatabaseError(DatabaseErrorKind::UniqueViolation, _) => {
                    http::ErrorBadRequest(self.unique_violation)
                }
                _ => http::ErrorInternalServerError(e),
            }
        } else {
            http::ErrorInternalServerError(e)
        }
    }
}
