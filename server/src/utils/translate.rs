use std::collections::HashMap;
use unicode_segmentation::UnicodeSegmentation;

pub struct SerbianCyrillic {}

impl SerbianCyrillic {
    fn get_lat_to_cyr_dictionary() -> HashMap<&'static str, &'static str> {
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
        let dict = Self::get_lat_to_cyr_dictionary();

        let splitted_latin: Vec<String> = Self::split_latin(&latin);

        let mut cyrillic = String::new();
        for grapheme in splitted_latin.iter() {
            match dict.get(grapheme as &str) {
                Some(cyr) => cyrillic.push_str(cyr),
                None => cyrillic.push_str(grapheme),
            }
        }

        cyrillic
    }

    fn split_latin(text: &str) -> Vec<String> {
        let dict = Self::get_lat_to_cyr_dictionary();
        // for example we have serbian "njegov čaj"

        // Here we split by letters;
        // ["n", "j", "e", "g", "o", "v", "č", "a", "j"]
        let letters = UnicodeSegmentation::graphemes(text, true).collect::<Vec<&str>>();

        // And here we make it correct for serbian dictionary, because sometimes 2 latin letters will be one letter in cyrillic: "nj" -> "њ"
        // ["nj", "e", "g", "o", "v", "č", "a", "j"]
        let mut letters_with_combinations: Vec<String> = vec![];
        let mut letters_group: Vec<&str> = vec![];
        for (right, letter) in letters.iter().enumerate() {
            letters_group.push(letter);

            while letters_group.len() > 1 {
                let combination = format!("{}{}", letters_group[0], letters_group[1]);
                if dict.contains_key(&combination.as_str()) {
                    letters_with_combinations.push(combination);
                    letters_group.clear();
                } else {
                    letters_with_combinations.push(letters_group[0].to_string());
                    letters_group = vec![letters_group[1]];
                }
            }

            if right == letters.len() - 1 && letters_group.len() == 1 {
                letters_with_combinations.push(letters_group[0].to_string());
            }
        }

        letters_with_combinations
    }
}

#[cfg(test)]
mod tests {
    use super::SerbianCyrillic;

    #[test]
    fn test_from_latin() {
        let cyrillic = SerbianCyrillic::from_latin("njegov čaj");
        assert_eq!(cyrillic, "његов чај");

        let cyrillic = SerbianCyrillic::from_latin("život i priključenja");
        assert_eq!(cyrillic, "живот и прикључења");

        let cyrillic = SerbianCyrillic::from_latin("ljulja se ljuljaška");
        assert_eq!(cyrillic, "љуља се љуљашка");

        let cyrillic = SerbianCyrillic::from_latin("džep pun para?");
        assert_eq!(cyrillic, "џеп пун пара?");

        let cyrillic = SerbianCyrillic::from_latin("");
        assert_eq!(cyrillic, "");
    }
}
