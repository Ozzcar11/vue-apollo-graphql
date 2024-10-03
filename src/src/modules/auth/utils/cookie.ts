import Cookies from "js-cookie";

import {
  USER_COOKIE_NAME,
  USER_COOKIE_OPTIONS,
} from "../constants/cookie";

export function getUserCookie() {
  return JSON.parse(Cookies.get(USER_COOKIE_NAME) ?? "{}") as Record<string, unknown>;
}

export function setUserCookie(data: object) {
  Cookies.set(USER_COOKIE_NAME, JSON.stringify(data), USER_COOKIE_OPTIONS);
}

export function removeUserCookie() {
  Cookies.remove(USER_COOKIE_NAME);
}
