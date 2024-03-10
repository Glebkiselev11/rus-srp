pub mod categories;
pub mod error_type;
pub mod schema;
pub mod users;
pub mod words;
pub mod words_categories;

use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};

pub type PgPool = Pool<ConnectionManager<PgConnection>>;
