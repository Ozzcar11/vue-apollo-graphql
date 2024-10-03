import Cookie from "js-cookie";

export const USER_COOKIE_NAME = "ozzcar11_rating";
export const USER_COOKIE_OPTIONS: typeof Cookie.attributes = {
  expires: 7,
  sameSite: "Lax",
};
