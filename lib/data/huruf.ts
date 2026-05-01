export type Huruf = {
  id: number;
  char: string; // huruf Jepang
  romaji: string; // cara baca
  type: "Hiragana" | "Katakana";
};

export const hurufList: Huruf[] = [
  // Hiragana
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

  // Katakana
  { id: 11, char: "ア", romaji: "a", type: "Katakana" },
  { id: 12, char: "イ", romaji: "i", type: "Katakana" },
  { id: 13, char: "ウ", romaji: "u", type: "Katakana" },
  { id: 14, char: "エ", romaji: "e", type: "Katakana" },
  { id: 15, char: "オ", romaji: "o", type: "Katakana" },
  { id: 16, char: "カ", romaji: "ka", type: "Katakana" },
  { id: 17, char: "キ", romaji: "ki", type: "Katakana" },
  { id: 18, char: "ク", romaji: "ku", type: "Katakana" },
  { id: 19, char: "ケ", romaji: "ke", type: "Katakana" },
  { id: 20, char: "コ", romaji: "ko", type: "Katakana" },
];
