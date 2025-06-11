const Koa = require("koa")
const log = console.log //чтобы не писать console.log каждый раз
const json = require("koa-json") //подключаем модуль для работы с JSON
const KoaRouter = require("koa-router") //подключаем роутер
const path = require("path") //подключаем модуль для работы с путями
const render = require("koa-ejs") //подключаем модуль для работы с шаблонами
const bodyParser = require("koa-bodyparser") //подключаем модуль для парсинга тела запроса

const app = new Koa() //подключение к фреймворку
const router = new KoaRouter() //создаем новый роутер

//В реальном проекте нужно использовать базу данных, но для простоты примера мы будем использовать статические данные
const thingsILove = ["Coding", "Coffee", "Music", "Nature", "Traveling"] //массив с данными, которые мы будем отображать на странице

//JSON prettier Middleware
app.use(json()) //включаем обработку JSON
//Body Parser Middleware
app.use(bodyParser()) //включаем парсер тела запроса

//Добавляем дополнительные свойства к контексту приложения
app.context.user = "Guest" //добавляем свойство user к контексту приложения

render(app, {
  root: path.join(__dirname, "views"), //указываем путь к папке с шаблонами
  layout: "layout", //указываем имя файла шаблона
  viewExt: "html", //указываем расширение файлов шаблонов
  cache: false, //отключаем кэширование шаблонов
  debug: false, //включаем режим отладки
})

//Routes
router.get("/", index)
router.get("/add", showAdd) //обрабатываем GET запрос на /add
router.post("/add", addThing) //обрабатываем POST запрос на /add

//функции для обработки GET запросов
async function showAdd(ctx) {
  await ctx.render("add") //рендерим шаблон add
  log("GET request to /add") //логируем запрос
}
async function index(ctx) {
  await ctx.render("index", { title: "Things I Love", things: thingsILove }) //рендерим шаблон index
  log("GET request to /") //логируем запрос
}

//функция для обработки POST запроса
async function addThing(ctx) {
  const body = ctx.request.body //получаем данные из тела запроса
  thingsILove.push(body.thing) //добавляем новый элемент в массив
  ctx.redirect("/") //перенаправляем на главную страницу
}

router.get("/test", (ctx) => (ctx.body = `Hi ${ctx.user}`)) //тестовый маршрут для проверки работы роутера

//Router Middleware
app.use(router.routes()) //подключаем роутер к приложению
app.use(router.allowedMethods()) //подключаем методы роутера

app.listen(3010, () => {
  log("Server running on http://localhost:3010")
}) //запуск сервера
