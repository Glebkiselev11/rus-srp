use actix_web::{web, HttpResponse, Responder};
use reqwest::{
    self,
    header::{HeaderMap, HeaderValue, CONTENT_TYPE},
};
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
    let client = reqwest::Client::new();

    let body = json!({
        "model": "gpt-4o",
        "messages": [{
            "role": "system",
            "content": format!(
                "eng: '{}', rus: '{}', srp_cyrillic: '{}', srp_latin: '{}' return json object with filled translation for empty strings",
                body.eng, body.rus, body.srp_cyrillic, body.srp_latin
            ),
        }]
    });

    let res = client.post(URL).headers(headers()).json(&body).send().await;

    match res {
        Ok(resp) => {
            let data: ResponseData = resp.json().await.unwrap();
            let content = &data.choices[0].message.content;
            let translation_result = serde_json::from_str::<serde_json::Value>(&content).unwrap();

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
