import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  // Первый аргумент: массив стандартных правил (берём только skipEmptyTargetValues)
  // Второй аргумент: кастомное правило поиска по колонкам даты, покупателя и продавца
  const compare = createComparison(
    [rules.skipEmptyTargetValues],
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false,
    ),
  );

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    // Фильтруем данные, оставляя только те строки, в которых есть искомый текст
    return data.filter((row) => compare(row, state));
  };
}
