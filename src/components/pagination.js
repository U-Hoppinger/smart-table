import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент
  pages.firstElementChild.remove(); // и удаляем его из HTML

  return (data, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPage = state.rowsPerPage; // сколько строк выводим на одной странице
    const pageCount = Math.ceil(data.length / rowsPerPage); // число страниц (округляем в большую сторону)
    let page = state.page; // текущая страница (может меняться ниже)

    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // на предыдущую
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // на следующую
        case "first":
          page = 1;
          break; // на первую
        case "last":
          page = pageCount;
          break; // на последнюю
      }

    // @todo: #2.4 — получить список видимых страниц и вывести их
    const visiblePages = getPages(page, pageCount, 5); // получаем массив из максимум 5 страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true); // клонируем шаблон
        return createPage(el, pageNumber, pageNumber === page); // заполняем его данными через коллбэк
      }),
    );

    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = (page - 1) * rowsPerPage + 1; // с какой строки выводим
    toRow.textContent = Math.min(page * rowsPerPage, data.length); // до какой строки выводим
    totalRows.textContent = data.length; // сколько всего строк

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (page - 1) * rowsPerPage; // сколько строк пропустить
    return data.slice(skip, skip + rowsPerPage); // возвращаем только нужный кусок массива
  };
};
