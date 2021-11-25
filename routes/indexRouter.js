const Router = require('koa-router')
const router = new Router()
const db = require('../private/db')

router.get('/', async ctx => {
  const locals = {title: 'Dover-Sherborn Swim and Dive'}

  // retrieve image and caption data
  const response = await db.get("http://api.dssd.team/home")

  // render page
  locals.data = response.data
  await ctx.render('index', locals, true)
})

module.exports = router