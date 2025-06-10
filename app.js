const Koa = require("koa")
const log = console.log //чтобы не писать console.log каждый раз
const json = require("koa-json") //подключаем модуль для работы с JSON
const KoaRouter = require("koa-router") //подключаем роутер
const path = require("path") //подключаем модуль для работы с путями
const render = require("koa-ejs") //подключаем модуль для работы с шаблонами

const app = new Koa() //подключение к фреймворку
const router = new KoaRouter() //создаем новый роутер

//JSON prettier Middleware
app.use(json()) //включаем обработку JSON

render(app, {
  root: path.join(__dirname, "views"), //указываем путь к папке с шаблонами
  layout: "layout", //указываем имя файла шаблона
  viewExt: "html", //указываем расширение файлов шаблонов
  cache: false, //отключаем кэширование шаблонов
  debug: false, //включаем режим отладки
})

//Index page
router.get("/", async (ctx) => {
  await ctx.render("index", { title: "Things I Love" }) //рендерим шаблон index
  log("GET request to /") //логируем запрос
})

router.get("/test", async (ctx) => {
  ctx.body = { message: "Hello, World!" } //обрабатываем GET запрос на /test
  log("GET request to /test") //логируем запрос
})

//Router Middleware
app.use(router.routes()) //подключаем роутер к приложению
app.use(router.allowedMethods()) //подключаем методы роутера

app.listen(3010, () => {
  log("Server running on http://localhost:3010")
}) //запуск сервера
