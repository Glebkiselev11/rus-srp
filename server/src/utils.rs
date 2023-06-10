extern crate bcrypt;
use bcrypt::{hash_with_salt, DEFAULT_COST};
use std::collections::HashMap;
use unicode_segmentation::UnicodeSegmentation;

pub fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    let chars_salt: Vec<char> = std::env::var("SALT")
        .expect("Password SALT env")
        .chars()
        .collect();

    let mut salt: [u8; 16] = [0; 16];
    for i in 0..16 {
        // Here doesn't matter how long or short salt from env was
        salt[i] = chars_salt[i % chars_salt.len()] as u8;
    }

    let hashed_password = hash_with_salt(password, DEFAULT_COST, salt)?;

    Ok(hashed_password.to_string())
}

pub fn serbian_latin_to_cyrillic(latin: &str) -> String {
    let lat_to_cyr: HashMap<&str, &str> = [
        ("A", "А"),
        ("B", "Б"),
        ("V", "В"),
        ("G", "Г"),
        ("D", "Д"),
        ("Đ", "Ђ"),
        ("E", "Е"),
        ("Ž", "Ж"),
        ("Z", "З"),
        ("I", "И"),
        ("J", "Ј"),
        ("K", "К"),
        ("L", "Л"),
        ("Lj", "Љ"),
        ("M", "М"),
        ("N", "Н"),
        ("Nj", "Њ"),
        ("O", "О"),
        ("P", "П"),
        ("R", "Р"),
        ("S", "С"),
        ("T", "Т"),
        ("Ć", "Ћ"),
        ("U", "У"),
        ("F", "Ф"),
        ("H", "Х"),
        ("C", "Ц"),
        ("Č", "Ч"),
        ("Dž", "Џ"),
        ("Š", "Ш"),
        ("a", "а"),
        ("b", "б"),
        ("v", "в"),
        ("g", "г"),
        ("d", "д"),
        ("đ", "ђ"),
        ("e", "е"),
        ("ž", "ж"),
        ("z", "з"),
        ("i", "и"),
        ("j", "ј"),
        ("k", "к"),
        ("l", "л"),
        ("lj", "љ"),
        ("m", "м"),
        ("n", "н"),
        ("nj", "њ"),
        ("o", "о"),
        ("p", "п"),
        ("r", "р"),
        ("s", "с"),
        ("t", "т"),
        ("ć", "ћ"),
        ("u", "у"),
        ("f", "ф"),
        ("h", "х"),
        ("c", "ц"),
        ("č", "ч"),
        ("dž", "џ"),
        ("š", "ш"),
    ]
    .iter()
    .cloned()
    .collect();

    let graphemes = UnicodeSegmentation::graphemes(latin, true).collect::<Vec<&str>>();

    let mut cyrillic = String::new();
    for grapheme in graphemes {
        println!("{grapheme}");
        match lat_to_cyr.get(grapheme) {
            Some(cyr) => cyrillic.push_str(cyr),
            None => cyrillic.push_str(grapheme),
        }
    }

    cyrillic
}
