export const headers = [
  {
    title: "Наименование",
    value: "name",
    isSortable: true,
    columnSize: "300px",
  },
  {
    title: "ИНН",
    value: "inn",
    isSortable: true,
    columnSize: "140px",
  },
  {
    title: "Категория",
    value: "company_category",
    columnSize: "240px",
  },
  {
    title: "Регион регистрации",
    value: "region_registration",
    columnSize: "300px",
  },
  {
    title: "Численность",
    value: "average_headcount",
    isSortable: true,
    columnSize: "240px",
  },
  {
    title: "Выручка за предыдущий год",
    value: "revenue_year",
    isSortable: true,
    columnSize: "300px",
  },
  {
    title: "Итоговый балл",
    value: "result_points",
    isSortable: true,
    columnSize: "140px",
  },
  {
    title: "Анкетирование",
    value: "status",
    isSortable: true,
    columnSize: "140px",
  },
] as const;
