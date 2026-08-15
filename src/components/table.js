import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  before.reverse().forEach((subName) => {
    // Клонируем по имени и сохраняем прямо в объект root (чтобы потом иметь к ним доступ)
    root[subName] = cloneTemplate(subName);
    // Вставляем В НАЧАЛО контейнера таблицы
    root.container.prepend(root[subName].container);
  });

  // Добавляем шаблоны ПОСЛЕ таблицы
  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    // Вставляем В КОНЕЦ контейнера таблицы
    root.container.append(root[subName].container);
  });

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", () => {
    onAction();
  });

  // Событие reset — когда форма сбрасывается (нужна задержка setTimeout)
  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  // Событие submit — отправка формы (предотвращаем перезагрузку страницы!)
  root.container.addEventListener("submit", (e) => {
    e.preventDefault(); // Отключаем стандартное поведение браузера
    onAction(e.submitter); // Передаем кнопку, которая вызвала отправку
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      object.keys(item).forEach((key) => {
        if (row.element[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return (row, container);
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
