export function returnNumbers(text: string) {
  return text.replaceAll(/\D/g, "");
}

export function returnNotNumbers(text: string) {
  return text.replaceAll(/\d/g, "");
}
