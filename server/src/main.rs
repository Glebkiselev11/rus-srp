#[macro_use]
extern crate diesel;

use std::env;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{http, web, App, HttpServer};
use actix_web_httpauth::middleware::HttpAuthentication;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};

mod db;
mod handlers;
mod models;
mod utils;

use crate::handlers as handler;

const API_URL: (&str, u16) = ("0.0.0.0", 8080);

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // set up database connection pool
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    log::info!("has been started at http://{}:{}", API_URL.0, API_URL.1,);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "DELETE", "PUT"])
            .allowed_header(http::header::CONTENT_TYPE)
            .allowed_header(http::header::AUTHORIZATION);

        let auth_guard = HttpAuthentication::bearer(utils::auth::validator);

        let app = App::new()
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
                        web::scope("/private")
                            .wrap(auth_guard)
                            .service(
                                web::scope("/words")
                                    .route("/create", web::post().to(handler::words::create))
                                    .route("", web::get().to(handler::words::get_list_by_query))
                                    .route(
                                        "/count",
                                        web::get().to(handler::words::get_count_by_query),
                                    )
                                    .route("/{id}", web::get().to(handler::words::get_by_id))
                                    .route("/{id}", web::put().to(handler::words::update))
                                    .route("/{id}", web::delete().to(handler::words::delete)),
                            )
                            .service(
                                web::scope("/categories")
                                    .route("/create", web::post().to(handler::categories::create))
                                    .route(
                                        "",
                                        web::get().to(handler::categories::get_list_by_query),
                                    )
                                    .route("/{id}", web::get().to(handler::categories::get_by_id))
                                    .route("/{id}", web::put().to(handler::categories::update))
                                    .route("/{id}", web::delete().to(handler::categories::delete))
                                    .route(
                                        "/{category_id}/add-words",
                                        web::put().to(handler::categories::add_words),
                                    )
                                    .route(
                                        "/{category_id}/delete-words",
                                        web::delete().to(handler::categories::delete_words),
                                    ),
                            )
                            .service(
                                web::scope("/services")
                                    .service(web::scope("/translation").route(
                                        "/translate",
                                        web::post().to(handler::services::translation::translate),
                                    ))
                                    .service(web::scope("/images").route(
                                        "/query",
                                        web::get().to(handler::services::images::query),
                                    )),
                            ),
                    ),
            );

        let environment = std::env::var("ENVIRONMENT").unwrap_or_else(|_| "dev".to_string());

        let app = match environment.as_str() {
            "dev" => app, // Sharing SPA files need only in production
            _ => app
                .service(fs::Files::new("/", "./static").index_file("index.html"))
                // Catch-All Route: Redirect all non-matched routes to index.html
                .default_service(
                    web::get().to(|| async { actix_files::NamedFile::open("./static/index.html") }),
                ),
        };

        app
    })
    .bind(API_URL)?
    .run()
    .await
}
