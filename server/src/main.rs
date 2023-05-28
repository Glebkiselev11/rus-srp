#[macro_use]
extern crate diesel;

use actix_cors::Cors;
use actix_web::{http, web, App, HttpServer};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};

mod db;
mod handlers;
mod models;
mod utils;

use crate::handlers as handler;

pub type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

const API_URL: (&str, u16) = ("0.0.0.0", 8080);

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // set up database connection pool
    let conn_spec = std::env::var("DATABASE_URL").expect("DATABASE_URL");
    let manager = ConnectionManager::<SqliteConnection>::new(conn_spec);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    log::info!("has been started at http://{}:{}", API_URL.0, API_URL.1,);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "DELETE", "PUT"])
            .allowed_header(http::header::CONTENT_TYPE);
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(cors)
            .service(
                web::scope("/api/v1")
                    .service(
                        web::scope("/auth")
                            .route("/register", web::post().to(handler::auth::register))
                            .route("/login", web::post().to(handler::auth::login)),
                    )
                    .service(
                        web::scope("/words")
                            .route("", web::get().to(handler::words::get_all_words))
                            .route("/{id}", web::delete().to(handler::words::delete))
                            .route("/{id}", web::get().to(handler::words::find_word_by_uid))
                            .route("/create", web::post().to(handler::words::add_word))
                            .route("/{id}", web::put().to(handler::words::update)),
                    )
                    .service(
                        web::scope("/word-categories")
                            .route("/create", web::post().to(handler::word_categories::create))
                            .route("/{id}", web::delete().to(handler::word_categories::delete))
                            .route("/{id}", web::get().to(handler::word_categories::get_by_id)),
                    ),
            )
    })
    .bind(API_URL)?
    .run()
    .await
}
