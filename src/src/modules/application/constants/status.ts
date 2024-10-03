export const APPLICATION_STATUS = {
  PROCESSED: "processed",
  IN_WORK: "in_work",
  UPDATED: "updated",
  UNALLOCATED: "unallocated",
  READY_TO_ASSESSMENT: "ready_to_assessment",
} as const;

export const APPLICATION_STATUS_TITLE = {
  [APPLICATION_STATUS.PROCESSED]: "Проверено",
  [APPLICATION_STATUS.IN_WORK]: "В работе",
  [APPLICATION_STATUS.UPDATED]: "Обновлено",
  [APPLICATION_STATUS.UNALLOCATED]: "Нераспределенные",
  [APPLICATION_STATUS.READY_TO_ASSESSMENT]: "Готово к оценке",
} as const;

export const APPLICATION_STATUS_ACTION = {
  [APPLICATION_STATUS.PROCESSED]: "Оценил анкету",
  [APPLICATION_STATUS.IN_WORK]: "Приступил к оценке анкеты",
} as const;

export type STATUS_VALUE_TYPE = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
