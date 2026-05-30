# Car Estimator

Car Estimator — веб-приложение для оценки стоимости автомобиля по его характеристикам:
марке, модели, году выпуска, цвету, мощности, типу кузова, пробегу и году оценки.

## Стек

- Frontend: React, Vite, CSS
- Сервер frontend: Node.js, Express
- Backend и модель: Python, pandas, scikit-learn, matplotlib
- Данные модели и справочники: CSV, TXT, SAV-файлы в `Car_Estimator/static`

## Структура проекта

```text
.
├── Cars.csv
├── requirements.txt
├── README.md
└── Car_Estimator
    ├── index.html
    ├── package.json
    ├── server.js
    ├── vite.config.mjs
    ├── src
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── components
    │   ├── services
    │   └── storage.js
    └── static
        ├── assets
        ├── files
        └── backend
```

Основной frontend-код находится в `Car_Estimator/src`.

Публичные ресурсы:

- `static/assets` — изображения и шрифты;
- `static/files` — справочники марок, моделей, цветов и типов кузова;
- `static/backend` — Python-код модели, тесты и данные модели.

## Требования

- Node.js и npm
- Python 3
- Python-зависимости из `requirements.txt`

## Запуск frontend в режиме разработки

Установите JavaScript-зависимости:

```bash
cd Car_Estimator
npm install
```

Запустите Vite dev server:

```bash
npm run dev
```

Откройте приложение:

[http://localhost:5173](http://localhost:5173)

## Production-сборка frontend

Соберите React-приложение:

```bash
cd Car_Estimator
npm run build
```

Запустите Express-сервер для собранного frontend:

```bash
npm start
```

По умолчанию `npm start` использует порт `80`.
Если нужен другой порт:

```bash
PORT=8080 npm start
```

## Backend

Установите Python-зависимости:

```bash
pip install -r requirements.txt
```

Frontend ожидает, что backend API будет доступен по адресу:

```text
http://localhost:6969/car
```

В текущем репозитории есть код модели:

```text
Car_Estimator/static/backend/analyze.py
```

Важно: в репозитории сейчас нет Flask entrypoint, который поднимает HTTP API `/car`.
Пока этот сервер не добавлен или не восстановлен, frontend будет запускаться, но страница результата покажет, что backend недоступен.

## Контракт API

Frontend отправляет `POST`-запрос на `/car`.

Пример тела запроса:

```json
{
  "data": [
    "BMW",
    "X5",
    2020,
    300,
    "SUV",
    2026,
    50000,
    "Black"
  ]
}
```

Порядок значений в массиве `data`:

1. `Make` — марка
2. `Model` — модель
3. `Year` — год выпуска
4. `HP` — мощность
5. `Body` — тип кузова
6. `Yearsell` — год оценки
7. `Odometer` — пробег
8. `Color` — цвет

Ожидаемый ответ:

```json
{
  "Price": 42000,
  "Photos": ["https://example.com/photo.jpg"],
  "Sell": 150
}
```

Страница результата также пытается загрузить график по пути:

```text
/backend/graph.png
```

## Настройка API URL

По умолчанию frontend обращается к:

```text
http://localhost:6969
```

Для dev-режима URL можно переопределить через переменную окружения:

```bash
VITE_API_BASE_URL=http://localhost:7000 npm run dev
```

## npm-скрипты

Команды выполняются из директории `Car_Estimator`.

```bash
npm run dev
```

Запускает Vite dev server.

```bash
npm run build
```

Собирает frontend в `Car_Estimator/dist`.

```bash
npm run preview
```

Запускает preview production-сборки средствами Vite.

```bash
npm start
```

Запускает Express-сервер, который отдает собранный frontend.

## Тесты

Python-тесты находятся в:

```text
Car_Estimator/static/backend/tests
```

Запуск:

```bash
cd Car_Estimator/static/backend
pytest
```

## Заметки для разработки

- Не коммитьте `node_modules` и `dist`.
- Frontend хранит текущий запрос оценки в `localStorage`.
- Справочники загружаются из `static/files`.
- `static/backend` сохранен как часть публичной статики для совместимости с текущей структурой проекта.
- Если backend API будет перенесен на другой порт или домен, обновите `VITE_API_BASE_URL`.

## Полезные ссылки

- [Figma](https://www.figma.com/design/CfgJgK4OwEes9OjVOWYBWi/CAR-ESTIMATOR?m=dev&node-id=0%3A1&t=NAbd90A9XBCEjKmu-1)
- [Google Colab](https://colab.research.google.com/drive/10jpg2uX0paPm-am67XX5Pg7iLZcLZYec?usp=sharing)

## Авторы

- Tech lead: Оспельников Алексей
- Идея: Капустин Григорий
- Frontend: Оспельников Алексей, Якшин Артемий
- Дизайн: Якшин Артемий, Оспельников Алексей
- Backend: Оспельников Алексей, Ананьев Никита, Якшин Артемий 
- Data science: Капустин Григорий, Оспельников Алексей, Ананьев Никита
