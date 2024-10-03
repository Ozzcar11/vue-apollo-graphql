export const headers = [
  {
    title: "ФИО",
    value: "full_name",
    isSortable: true,
  },
  {
    title: "Электронная почта",
    value: "email",
  },
  {
    title: "Роль",
    value: "role.title",
    isSortable: true,
  },
  {
    title: "Администратор",
    value: "maintainer.full_name",
    isSortable: true,
  },
] as const;
