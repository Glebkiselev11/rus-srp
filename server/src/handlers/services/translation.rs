use actix_web::{web, HttpResponse, Responder};
use reqwest::{
    self,
    header::{HeaderMap, HeaderValue, CONTENT_TYPE},
};
use serde::{Deserialize, Serialize};
use serde_json::json;

const API_VERSION: [(&str, &str); 1] = [("api-version", "3.0")];

#[derive(Serialize, Deserialize, Debug, Clone)]
enum Language {
    Ru,
    En,
    SrpLatin,
    SrpCyrillic,
}

impl Language {
    pub fn as_str(&self) -> &'static str {
        match *self {
            Language::Ru => "ru",
            Language::En => "en",
            Language::SrpCyrillic => "sr-Cyrl",
            Language::SrpLatin => "hr",
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TranslatePayload {
    from: Language,
    text: String,
    targets: Vec<Language>,
}

#[derive(Deserialize, Debug, Serialize)]
struct Translation {
    text: String,
    to: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct ResponseData {
    translations: Vec<Translation>,
}

pub async fn translate(body: web::Json<TranslatePayload>) -> actix_web::Result<impl Responder> {
    let text = body.text.clone();
    let targets = body.targets.clone();
    let from = body.from.clone().as_str();

    let client = reqwest::Client::new();

    let query_targets = || -> Vec<(String, &str)> {
        targets
            .iter()
            .enumerate()
            .fold(vec![], |mut query, (i, to)| {
                query.push((format!("to[{i}]"), to.as_str()));
                query
            })
    };

    let body = json!([{ "Text": text, "from": from }]);

    let res = client
        .post(url("translate"))
        .headers(headers())
        .query(&API_VERSION)
        .query(&query_targets())
        .json(&body)
        .send()
        .await;

    match res {
        Ok(resp) => {
            let data: Vec<ResponseData> = resp.json().await.unwrap();

            Ok(HttpResponse::Ok().json(ResponseData {
                translations: data[0]
                    .translations
                    .iter()
                    .map(|x| {
                        return Translation {
                            text: x.text.clone(),
                            to: (match x.to.as_str() {
                                "ru" => "rus",
                                "en" => "eng",
                                "sr-Cyrl" => "srp_cyrillic",
                                "hr" => "srp_latin",
                                _ => "unknown",
                            })
                            .to_string(),
                        };
                    })
                    .collect(),
            }))
        }
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn url(path: &str) -> String {
    format!("https://microsoft-translator-text.p.rapidapi.com/{path}")
}

fn headers() -> HeaderMap {
    let mut headers = HeaderMap::new();

    headers.insert(
        "X-RapidAPI-Key",
        HeaderValue::from_str(&std::env::var("RAPID_API_KEY").unwrap()).unwrap(),
    );
    headers.insert(
        "X-RapidAPI-Host",
        HeaderValue::from_static("microsoft-translator-text.p.rapidapi.com"),
    );
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    headers
}
