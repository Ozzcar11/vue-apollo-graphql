export const ACTIONS = {
  user_create: "user_create",
  user_update: "user_update",
  user_delete: "user_delete",
  partner_offer_create: "partner_offer_create",
  partner_offer_update: "partner_offer_update",
  partner_offer_delete: "partner_offer_delete",
  user_application_proceede: "user_application_proceede",
  user_application_finish: "user_application_finish",

} as const;

export const ACTIONS_TITLE = {
  [ACTIONS.user_create]: "Добавил пользователя",
  [ACTIONS.user_update]: "Изменил пользователя",
  [ACTIONS.user_delete]: "Удалил пользователя",
  [ACTIONS.partner_offer_create]: "Добавил предложение от партнёров",
  [ACTIONS.partner_offer_update]: "Изменил предложение от партнёров",
  [ACTIONS.partner_offer_delete]: "Удалил предложение от партнёров",
  [ACTIONS.user_application_proceede]: "Приступил к оценке анкеты",
  [ACTIONS.user_application_finish]: "Оценил анкету",
} as const;

export const ACTIONS_TYPE_CRUD = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

export const ACTIONS_TYPENAME = {
  USER: "User",
  PARTNEROFFER: "PartnerOffer",
  USERAPPLICATION: "UserApplication",
} as const;

export const ACTIONS_NAMES = {
  [ACTIONS_TYPE_CRUD.CREATE]: {
    [ACTIONS_TYPENAME.USER]: ACTIONS_TITLE[ACTIONS.user_create],
    [ACTIONS_TYPENAME.PARTNEROFFER]: ACTIONS_TITLE[ACTIONS.partner_offer_create],
  },
  [ACTIONS_TYPE_CRUD.UPDATE]: {
    [ACTIONS_TYPENAME.USER]: ACTIONS_TITLE[ACTIONS.user_update],
    [ACTIONS_TYPENAME.PARTNEROFFER]: ACTIONS_TITLE[ACTIONS.partner_offer_update],
  },
  [ACTIONS_TYPE_CRUD.DELETE]: {
    [ACTIONS_TYPENAME.USER]: ACTIONS_TITLE[ACTIONS.user_delete],
    [ACTIONS_TYPENAME.PARTNEROFFER]: ACTIONS_TITLE[ACTIONS.partner_offer_delete],
  },
} as const;
