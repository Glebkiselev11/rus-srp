use actix_web::{web, HttpResponse, Responder};
use reqwest::{
    self,
    header::{HeaderMap, HeaderValue, CONTENT_TYPE},
};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug, Clone)]
enum Language {
    RU,
    EN,
    SR,
}

impl Language {
    pub fn as_str(&self) -> &'static str {
        match *self {
            Language::RU => "ru",
            Language::EN => "en",
            Language::SR => "sr",
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TranslatePayload {
    from: Language,
    text: String,
    target: Vec<Language>,
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
    let target = body.target.clone();
    let from = body.from.clone().as_str();

    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();

    let form_query_target = || {
        let mut query: Vec<(String, &str)> = vec![];

        for (i, t) in target.iter().enumerate() {
            query.push((format!("to[{i}]"), t.as_str()))
        }

        return query;
    };

    headers.insert(
        "X-RapidAPI-Key",
        HeaderValue::from_str(&std::env::var("MICROSOFT_API_KEY").unwrap()).unwrap(),
    );
    headers.insert(
        "X-RapidAPI-Host",
        HeaderValue::from_static("microsoft-translator-text.p.rapidapi.com"),
    );
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    let body = json!([{ "Text": text, "from": from }]);

    let res = client
        .post("https://microsoft-translator-text.p.rapidapi.com/translate")
        .headers(headers)
        .query(&[("api-version", "3.0"), ("profanityAction", "NoAction")])
        .query(&form_query_target())
        .json(&body)
        .send()
        .await;

    match res {
        Ok(resp) => {
            let data: Vec<ResponseData> = resp.json().await.unwrap();

            Ok(HttpResponse::Ok().json(&data[0]))
        }
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}
