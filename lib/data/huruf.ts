export type Huruf = {
  id: number;
  char: string;
  romaji: string;
  type: "Hiragana" | "Katakana";
};

export const hurufList: Huruf[] = [
  // ===== HIRAGANA =====
  { id: 1, char: "あ", romaji: "a", type: "Hiragana" },
  { id: 2, char: "い", romaji: "i", type: "Hiragana" },
  { id: 3, char: "う", romaji: "u", type: "Hiragana" },
  { id: 4, char: "え", romaji: "e", type: "Hiragana" },
  { id: 5, char: "お", romaji: "o", type: "Hiragana" },

  { id: 6, char: "か", romaji: "ka", type: "Hiragana" },
  { id: 7, char: "き", romaji: "ki", type: "Hiragana" },
  { id: 8, char: "く", romaji: "ku", type: "Hiragana" },
  { id: 9, char: "け", romaji: "ke", type: "Hiragana" },
  { id: 10, char: "こ", romaji: "ko", type: "Hiragana" },

  { id: 11, char: "さ", romaji: "sa", type: "Hiragana" },
  { id: 12, char: "し", romaji: "shi", type: "Hiragana" },
  { id: 13, char: "す", romaji: "su", type: "Hiragana" },
  { id: 14, char: "せ", romaji: "se", type: "Hiragana" },
  { id: 15, char: "そ", romaji: "so", type: "Hiragana" },

  { id: 16, char: "た", romaji: "ta", type: "Hiragana" },
  { id: 17, char: "ち", romaji: "chi", type: "Hiragana" },
  { id: 18, char: "つ", romaji: "tsu", type: "Hiragana" },
  { id: 19, char: "て", romaji: "te", type: "Hiragana" },
  { id: 20, char: "と", romaji: "to", type: "Hiragana" },

  { id: 21, char: "な", romaji: "na", type: "Hiragana" },
  { id: 22, char: "に", romaji: "ni", type: "Hiragana" },
  { id: 23, char: "ぬ", romaji: "nu", type: "Hiragana" },
  { id: 24, char: "ね", romaji: "ne", type: "Hiragana" },
  { id: 25, char: "の", romaji: "no", type: "Hiragana" },

  { id: 26, char: "は", romaji: "ha", type: "Hiragana" },
  { id: 27, char: "ひ", romaji: "hi", type: "Hiragana" },
  { id: 28, char: "ふ", romaji: "fu", type: "Hiragana" },
  { id: 29, char: "へ", romaji: "he", type: "Hiragana" },
  { id: 30, char: "ほ", romaji: "ho", type: "Hiragana" },

  { id: 31, char: "ま", romaji: "ma", type: "Hiragana" },
  { id: 32, char: "み", romaji: "mi", type: "Hiragana" },
  { id: 33, char: "む", romaji: "mu", type: "Hiragana" },
  { id: 34, char: "め", romaji: "me", type: "Hiragana" },
  { id: 35, char: "も", romaji: "mo", type: "Hiragana" },

  { id: 36, char: "や", romaji: "ya", type: "Hiragana" },
  { id: 37, char: "ゆ", romaji: "yu", type: "Hiragana" },
  { id: 38, char: "よ", romaji: "yo", type: "Hiragana" },

  { id: 39, char: "ら", romaji: "ra", type: "Hiragana" },
  { id: 40, char: "り", romaji: "ri", type: "Hiragana" },
  { id: 41, char: "る", romaji: "ru", type: "Hiragana" },
  { id: 42, char: "れ", romaji: "re", type: "Hiragana" },
  { id: 43, char: "ろ", romaji: "ro", type: "Hiragana" },

  { id: 44, char: "わ", romaji: "wa", type: "Hiragana" },
  { id: 45, char: "を", romaji: "wo", type: "Hiragana" },
  { id: 46, char: "ん", romaji: "n", type: "Hiragana" },

  // ===== KATAKANA =====
  { id: 47, char: "ア", romaji: "a", type: "Katakana" },
  { id: 48, char: "イ", romaji: "i", type: "Katakana" },
  { id: 49, char: "ウ", romaji: "u", type: "Katakana" },
  { id: 50, char: "エ", romaji: "e", type: "Katakana" },
  { id: 51, char: "オ", romaji: "o", type: "Katakana" },

  { id: 52, char: "カ", romaji: "ka", type: "Katakana" },
  { id: 53, char: "キ", romaji: "ki", type: "Katakana" },
  { id: 54, char: "ク", romaji: "ku", type: "Katakana" },
  { id: 55, char: "ケ", romaji: "ke", type: "Katakana" },
  { id: 56, char: "コ", romaji: "ko", type: "Katakana" },

  { id: 57, char: "サ", romaji: "sa", type: "Katakana" },
  { id: 58, char: "シ", romaji: "shi", type: "Katakana" },
  { id: 59, char: "ス", romaji: "su", type: "Katakana" },
  { id: 60, char: "セ", romaji: "se", type: "Katakana" },
  { id: 61, char: "ソ", romaji: "so", type: "Katakana" },

  { id: 62, char: "タ", romaji: "ta", type: "Katakana" },
  { id: 63, char: "チ", romaji: "chi", type: "Katakana" },
  { id: 64, char: "ツ", romaji: "tsu", type: "Katakana" },
  { id: 65, char: "テ", romaji: "te", type: "Katakana" },
  { id: 66, char: "ト", romaji: "to", type: "Katakana" },

  { id: 67, char: "ナ", romaji: "na", type: "Katakana" },
  { id: 68, char: "ニ", romaji: "ni", type: "Katakana" },
  { id: 69, char: "ヌ", romaji: "nu", type: "Katakana" },
  { id: 70, char: "ネ", romaji: "ne", type: "Katakana" },
  { id: 71, char: "ノ", romaji: "no", type: "Katakana" },

  { id: 72, char: "ハ", romaji: "ha", type: "Katakana" },
  { id: 73, char: "ヒ", romaji: "hi", type: "Katakana" },
  { id: 74, char: "フ", romaji: "fu", type: "Katakana" },
  { id: 75, char: "ヘ", romaji: "he", type: "Katakana" },
  { id: 76, char: "ホ", romaji: "ho", type: "Katakana" },

  { id: 77, char: "マ", romaji: "ma", type: "Katakana" },
  { id: 78, char: "ミ", romaji: "mi", type: "Katakana" },
  { id: 79, char: "ム", romaji: "mu", type: "Katakana" },
  { id: 80, char: "メ", romaji: "me", type: "Katakana" },
  { id: 81, char: "モ", romaji: "mo", type: "Katakana" },

  { id: 82, char: "ヤ", romaji: "ya", type: "Katakana" },
  { id: 83, char: "ユ", romaji: "yu", type: "Katakana" },
  { id: 84, char: "ヨ", romaji: "yo", type: "Katakana" },

  { id: 85, char: "ラ", romaji: "ra", type: "Katakana" },
  { id: 86, char: "リ", romaji: "ri", type: "Katakana" },
  { id: 87, char: "ル", romaji: "ru", type: "Katakana" },
  { id: 88, char: "レ", romaji: "re", type: "Katakana" },
  { id: 89, char: "ロ", romaji: "ro", type: "Katakana" },

  { id: 90, char: "ワ", romaji: "wa", type: "Katakana" },
  { id: 91, char: "ヲ", romaji: "wo", type: "Katakana" },
  { id: 92, char: "ン", romaji: "n", type: "Katakana" },
];
