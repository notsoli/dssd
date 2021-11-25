// configure koa
const Koa = require('koa')
const app = new Koa()

// node middleware
const path = require('path')
const fs = require('fs')

// koa middleware
const static = require('koa-static')
const koaBody = require('koa-body')
const bodyClean = require('koa-body-clean')

// config
const { PORT } = require('./private/config')

// establish api connection
const db = require('./private/db')
db.establish()

// configure pug
const Pug = require('koa-pug')
const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  locals: {title: "Dover-Sherborn Swim and Dive"},
  app: app
})

// configure body parser
app.use(koaBody({
  formidable: {uploadDir: './data/images/temp'},
  multipart: true
}))
app.use(bodyClean())

// handle thrown errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    ctx.status = err.status || 500

    // log error message
    console.log(err.message)

    // render error
    ctx.body = await pug.render('error', {code: err.status, message: err.message})
  }
})

// static files
app.use(static(path.join(__dirname, 'public')))

// page routers
// const routes = ['index', 'results', 'records', 'auth', 'meet', 'markdown']
const routes = fs.readdirSync('./routes/')
routes.forEach(route => {
  const router = require('./routes/' + route)
  app.use(router.routes())
})

// end of stream, throw 404
app.use(async ctx => {
  ctx.throw(404, 'Page or resource does not exist')
})

// start server
app.listen(PORT)
console.log(`Listening on port ${PORT}.`)