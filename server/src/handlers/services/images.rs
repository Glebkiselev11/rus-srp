use crate::models::pagination::Pagination;
use actix_web::{web, HttpResponse, Responder};
use reqwest::{
    self,
    header::{HeaderMap, HeaderValue},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
pub struct ImagesQueryParams {
    pub search: String,
    pub offset: u32,
    pub limit: u32,
}

#[derive(Deserialize, Debug, Serialize)]
struct PhotoSrc {
    original: String,
    large: String,
    medium: String,
    small: String,
    portrait: String,
    landscape: String,
    tiny: String,
}

#[derive(Deserialize, Debug, Serialize)]
struct Photo {
    id: u64,
    width: u16,
    height: u16,
    avg_color: String,
    src: PhotoSrc,
}

#[derive(Deserialize, Serialize, Debug)]
struct ResponseData {
    page: u32,
    per_page: u32,
    total_results: usize,
    photos: Vec<Photo>,
}

pub async fn query(params: web::Query<ImagesQueryParams>) -> actix_web::Result<impl Responder> {
    let params = params.into_inner();

    let client = reqwest::Client::new();

    let res = client
        .get(url("search"))
        .headers(headers())
        .query(&[
            ("query", params.search),
            ("per_page", params.limit.to_string()),
            ("page", params.offset.to_string()),
        ])
        .send()
        .await;

    match res {
        Ok(resp) => {
            let data: ResponseData = resp.json().await.unwrap();
            Ok(HttpResponse::Ok().json(Pagination {
                offset: data.page,
                count: data.total_results,
                result: data.photos,
            }))
        }
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn url(path: &str) -> String {
    format!("https://pexelsdimasv1.p.rapidapi.com/v1/{path}")
}

fn headers() -> HeaderMap {
    let mut headers = HeaderMap::new();

    headers.insert(
        "Authorization",
        HeaderValue::from_str(
            &std::env::var("PEXELS_API_KEY").expect("Pexels api key not provided"),
        )
        .unwrap(),
    );

    headers.insert(
        "X-RapidAPI-Key",
        HeaderValue::from_str(&std::env::var("RAPID_API_KEY").expect("Rapid api key not provided"))
            .unwrap(),
    );
    headers.insert(
        "X-RapidAPI-Host",
        HeaderValue::from_static("PexelsdimasV1.p.rapidapi.com"),
    );

    headers
}
