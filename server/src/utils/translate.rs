use std::collections::HashMap;
use unicode_segmentation::UnicodeSegmentation;

pub struct SerbianCyrillic {}

impl SerbianCyrillic {
    fn get_lat_to_cyr_dictionary<'a>() -> HashMap<&'a str, &'a str> {
        [
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
        .collect()
    }

    pub fn from_latin(latin: &str) -> String {
        let dictionary = Self::get_lat_to_cyr_dictionary();

        let graphemes = UnicodeSegmentation::graphemes(latin, true).collect::<Vec<&str>>();
        let mut _graphemes: Vec<String> = vec![];
        let mut letters_group: Vec<&str> = vec![];
        for (right, letter) in graphemes.iter().enumerate() {
            letters_group.push(letter);

            while letters_group.len() > 1 {
                let combination = format!("{}{}", letters_group[0], letters_group[1]);
                if dictionary.contains_key(&combination.as_str()) {
                    _graphemes.push(combination);
                    letters_group.clear();
                } else {
                    _graphemes.push(letters_group[0].to_string());
                    letters_group = vec![letters_group[1]];
                }
            }

            if right == graphemes.len() - 1 && letters_group.len() == 1 {
                _graphemes.push(letters_group[0].to_string());
            }
        }
        drop(graphemes);

        let mut cyrillic = String::new();
        for grapheme in _graphemes.iter() {
            match dictionary.get(grapheme as &str) {
                Some(cyr) => cyrillic.push_str(cyr),
                None => cyrillic.push_str(grapheme),
            }
        }

        cyrillic
    }
}
