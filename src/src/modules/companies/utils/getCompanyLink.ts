export function getCompanyLink(inn: string) {
  return `${import.meta.env.VITE_APP_PUBLIC_URL}/companies/${inn}`;
}
