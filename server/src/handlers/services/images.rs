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
}

#[derive(Deserialize, Debug, Serialize)]
struct ResponsePhoto {
    id: u64,
    width: u16,
    height: u16,
    avg_color: String,
    src: PhotoSrc,
}

#[derive(Deserialize, Serialize, Debug)]
struct ResponseData {
    page: u32,
    per_page: i64,
    total_results: i64,
    photos: Vec<ResponsePhoto>,
}

#[derive(Deserialize, Debug, Serialize, Clone)]
struct Photo {
    id: u64,
    width: u16,
    height: u16,
    avg_color: String,
    src: String,
}

impl From<ResponsePhoto> for Photo {
    fn from(response_photo: ResponsePhoto) -> Self {
        Photo {
            id: response_photo.id,
            width: response_photo.width,
            height: response_photo.height,
            avg_color: response_photo.avg_color,
            src: response_photo.src.original,
        }
    }
}

fn offset_to_page(offset: u32, limit: u32) -> u32 {
    (offset + limit - 1) / limit + 1
}

fn page_to_offset(page: u32, limit: u32) -> i64 {
    ((page - 1) * limit) as i64
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
            (
                "page",
                offset_to_page(params.offset, params.limit).to_string(),
            ),
        ])
        .send()
        .await;

    match res {
        Ok(resp) => {
            let data: ResponseData = resp.json().await.unwrap();
            Ok(HttpResponse::Ok().json(Pagination {
                offset: page_to_offset(data.page, params.limit),
                count: data.total_results,
                result: data
                    .photos
                    .into_iter()
                    .map(|x: ResponsePhoto| Photo::from(x))
                    .collect(),
            }))
        }
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn url(path: &str) -> String {
    format!("https://api.pexels.com/v1/{path}")
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

    headers
}
