#[macro_use]
extern crate diesel;

use actix_cors::Cors;
use actix_web::{get, http, post, web, App, HttpResponse, HttpServer, Responder, Result};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use serde::Serialize;

mod actions;
mod models;
mod schema;

type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

const API_URL: (&str, u16) = ("127.0.0.1", 7070);

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
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_header(http::header::CONTENT_TYPE);
        App::new()
            // set up DB pool to be used with web::Data<Pool> extractor
            .app_data(web::Data::new(pool.clone()))
            .wrap(cors)
            .service(
                web::scope("/api/v1")
                    .service(hello)
                    .service(info)
                    .service(web::scope("/words").service(add_word)),
            )
    })
    .bind(API_URL)?
    .run()
    .await
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Rus-Srp server")
}

#[get("/info")]
async fn info() -> impl Responder {
    #[derive(Serialize)]
    struct Info {
        version: String,
        author: String,
    }

    web::Json(Info {
        version: "v1".to_string(),
        author: "Gleb Kiselev".to_string(),
    })
}

#[post("/create")]
async fn add_word(
    pool: web::Data<DbPool>,
    body: web::Json<models::NewWord>,
) -> Result<impl Responder> {
    let word = models::NewWord {
        rus: body.rus.clone(),
        srp_latin: body.srp_latin.clone(),
        srp_cyrillic: body.srp_cyrillic.clone(),
    };

    // use web::block to offload blocking Diesel code without blocking server thread
    let user = web::block(move || {
        let conn = pool.get()?;
        actions::insert_new_user(word, &conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(user))
}
