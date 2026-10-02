import type { Locale } from "@/lib/content";

export type CountryOption = {
  dialCode?: string;
  value: string;
  phonePlaceholder: string;
  labels: Record<Locale, string>;
};

export const countryOptions: CountryOption[] = [
  { value: "Korea", dialCode: "+82", phonePlaceholder: "010-1234-1234", labels: { "zh-CN": "韩国", ko: "대한민국", en: "Korea", es: "Corea" } },
  { value: "United States", dialCode: "+1", phonePlaceholder: "+1 212 555 1234", labels: { "zh-CN": "美国", ko: "미국", en: "United States", es: "Estados Unidos" } },
  { value: "Japan", dialCode: "+81", phonePlaceholder: "+81 90 1234 5678", labels: { "zh-CN": "日本", ko: "일본", en: "Japan", es: "Japon" } },
  { value: "China", dialCode: "+86", phonePlaceholder: "+86 138 0013 8000", labels: { "zh-CN": "中国", ko: "중국", en: "China", es: "China" } },
  { value: "Taiwan", dialCode: "+886", phonePlaceholder: "+886 912 345 678", labels: { "zh-CN": "台湾", ko: "대만", en: "Taiwan", es: "Taiwan" } },
  { value: "Hong Kong", dialCode: "+852", phonePlaceholder: "+852 5123 4567", labels: { "zh-CN": "香港", ko: "홍콩", en: "Hong Kong", es: "Hong Kong" } },
  { value: "Singapore", dialCode: "+65", phonePlaceholder: "+65 8123 4567", labels: { "zh-CN": "新加坡", ko: "싱가포르", en: "Singapore", es: "Singapur" } },
  { value: "Thailand", dialCode: "+66", phonePlaceholder: "+66 81 234 5678", labels: { "zh-CN": "泰国", ko: "태국", en: "Thailand", es: "Tailandia" } },
  { value: "Vietnam", dialCode: "+84", phonePlaceholder: "+84 912 345 678", labels: { "zh-CN": "越南", ko: "베트남", en: "Vietnam", es: "Vietnam" } },
  { value: "Philippines", dialCode: "+63", phonePlaceholder: "+63 917 123 4567", labels: { "zh-CN": "菲律宾", ko: "필리핀", en: "Philippines", es: "Filipinas" } },
  { value: "Indonesia", dialCode: "+62", phonePlaceholder: "+62 812 3456 7890", labels: { "zh-CN": "印度尼西亚", ko: "인도네시아", en: "Indonesia", es: "Indonesia" } },
  { value: "Malaysia", dialCode: "+60", phonePlaceholder: "+60 12 345 6789", labels: { "zh-CN": "马来西亚", ko: "말레이시아", en: "Malaysia", es: "Malasia" } },
  { value: "Australia", dialCode: "+61", phonePlaceholder: "+61 412 345 678", labels: { "zh-CN": "澳大利亚", ko: "호주", en: "Australia", es: "Australia" } },
  { value: "Canada", dialCode: "+1", phonePlaceholder: "+1 416 555 1234", labels: { "zh-CN": "加拿大", ko: "캐나다", en: "Canada", es: "Canada" } },
  { value: "United Kingdom", dialCode: "+44", phonePlaceholder: "+44 7700 900123", labels: { "zh-CN": "英国", ko: "영국", en: "United Kingdom", es: "Reino Unido" } },
  { value: "France", dialCode: "+33", phonePlaceholder: "+33 6 12 34 56 78", labels: { "zh-CN": "法国", ko: "프랑스", en: "France", es: "Francia" } },
  { value: "Germany", dialCode: "+49", phonePlaceholder: "+49 151 23456789", labels: { "zh-CN": "德国", ko: "독일", en: "Germany", es: "Alemania" } },
  { value: "Spain", dialCode: "+34", phonePlaceholder: "+34 600 000 000", labels: { "zh-CN": "西班牙", ko: "스페인", en: "Spain", es: "Espana" } },
  { value: "Mexico", dialCode: "+52", phonePlaceholder: "+52 55 1234 5678", labels: { "zh-CN": "墨西哥", ko: "멕시코", en: "Mexico", es: "Mexico" } },
  { value: "Brazil", dialCode: "+55", phonePlaceholder: "+55 11 91234 5678", labels: { "zh-CN": "巴西", ko: "브라질", en: "Brazil", es: "Brasil" } },
  { value: "Other", phonePlaceholder: "+국가번호 전화번호", labels: { "zh-CN": "其他", ko: "기타", en: "Other", es: "Otro" } }
];

export function getCountryLabel(value: string, locale: Locale) {
  return countryOptions.find((country) => country.value === value)?.labels[locale] ?? value;
}

export function getCountryPhonePlaceholder(value: string) {
  return countryOptions.find((country) => country.value === value)?.phonePlaceholder ?? "+국가번호 전화번호";
}

export function getCountryDialCode(value: string) {
  return countryOptions.find((country) => country.value === value)?.dialCode ?? "";
}
