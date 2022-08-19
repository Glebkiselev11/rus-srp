use actix_cors::Cors;
use actix_web::{get, http, post, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};
const API_URL: (&str, u16) = ("127.0.0.1", 7070);

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!(
        "Server has been started at http://{}:{}",
        API_URL.0, API_URL.1
    );

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173/")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_header(http::header::CONTENT_TYPE);
        App::new().wrap(cors).service(hello).service(create)
    })
    .bind(API_URL)?
    .run()
    .await
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Rus-Srp server")
}

#[post("/create")]
async fn create(body: web::Json<NewWord>) -> Result<impl Responder> {
    let word = NewWord {
        rus: body.rus.clone(),
        srp_latin: body.srp_latin.clone(),
        srp_cyrillic: body.srp_cyrillic.clone(),
    };

    Ok(web::Json(word))
}

#[derive(Deserialize, Serialize)]
struct NewWord {
    rus: String,
    srp_latin: String,
    srp_cyrillic: String,
}
