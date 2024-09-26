use actix_web::{web, HttpResponse, Responder};
use reqwest::{
    self,
    header::{HeaderMap, HeaderValue, CONTENT_TYPE},
};
use serbian_cyrillic_latin_conversion::Convertion;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
pub struct AiTranslatePayload {
    eng: String,
    rus: String,
    srp_cyrillic: String,
    srp_latin: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Message {
    role: String,
    content: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Choice {
    index: i64,
    message: Message,
}

#[derive(Deserialize, Serialize, Debug)]
struct ResponseData {
    choices: Vec<Choice>,
}

const URL: &str = "https://api.openai.com/v1/chat/completions";

pub async fn translate(body: web::Json<AiTranslatePayload>) -> actix_web::Result<impl Responder> {
    let srp_latin = if !body.srp_cyrillic.is_empty() && body.srp_latin.is_empty() {
        Convertion::from_cyrillic(&body.srp_cyrillic)
    } else if !body.srp_latin.is_empty() {
        body.srp_latin.clone()
    } else {
        String::new()
    };

    let body_to_send = json!({
        "model": "gpt-4",
        // response_format is needed for 4o model
        // "response_format": { "type": "json_object" },
        "messages": [{
            "role": "system",
            "content": format!(
                "eng: '{}', rus: '{}', srp_latin: '{}' return
                json object with filled translation for empty strings",
                body.eng, body.rus, srp_latin
            ),
        }]
    });

    let res = reqwest::Client::new()
        .post(URL)
        .headers(headers())
        .json(&body_to_send)
        .send()
        .await;

    match res {
        Ok(resp) => {
            let data: ResponseData = resp.json().await.unwrap();
            let content = &data.choices[0].message.content;
            let mut translation_result =
                serde_json::from_str::<serde_json::Value>(&content).unwrap();

            translation_result["srp_cyrillic"] = if !body.srp_cyrillic.is_empty() {
                body.srp_cyrillic.as_str().into()
            } else {
                Convertion::from_latin(&translation_result["srp_latin"].as_str().unwrap()).into()
            };

            Ok(HttpResponse::Ok().json(translation_result))
        }
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn headers() -> HeaderMap {
    let mut headers = HeaderMap::new();

    let bearer = format!("Bearer {}", &std::env::var("OPENAI_API_KEY").unwrap());

    headers.insert("Authorization", bearer.parse().unwrap());

    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    headers
}
