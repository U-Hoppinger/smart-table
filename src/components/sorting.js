import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      // Переключаем направление (возрастание -> убывание -> нет -> ...) по карте sortMap
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none"; // 'none' — это начальное состояние
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      // Если перерисовка вызвана не кликом по сортировке, а чем-то другим (например, пагинацией),
      // мы ищем колонку, которая сейчас отсортирована, и применяем её настройки.
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Утилита sortCollection уже написана заранее, мы просто отдаем ей нужные данные
    return sortCollection(data, field, order);
  };
}
