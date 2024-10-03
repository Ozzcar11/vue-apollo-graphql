export const getReadbleNumber = (value: number | string) => {
  return new Intl.NumberFormat().format(+value);
};

export function formatRevenue(value: number) {
  const numberValue = value.toString();
  if (numberValue.length >= 7) return new Intl.NumberFormat().format(value).slice(0, -8) + " млн ₽";
  if (numberValue.length >= 6) return `0,${numberValue.slice(0, -3)} млн ₽`;
  if (numberValue.length >= 5) return `0,0${numberValue.slice(0, -3)} млн ₽`;
  if (value === 0) return "0,130 млн ₽";

  return numberValue + " ₽";
}

export function stringToPhone(value: string) {
  return value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
}
