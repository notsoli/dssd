const Router = require('koa-router')
const router = new Router()
const { authCheck } = require('../private/auth')
const { marked } = require('marked')
const db = require('../private/db')

async function parse(url) {
  // retrieve and parse content
  const response = await db.get(url)
  return marked.parse(response.data.content)
}

router.get('/contact', async ctx => {
  const locals = {title: 'DSSD - Contact'}
  
  // authenticate user
  const result = await authCheck(ctx)

  if (result.valid) {
    // render content
    locals.content = await parse('http://api.dssd.team/contact')
    await ctx.render('markdown', locals, true)
  }
})

router.get('/resources', async ctx => {
  const locals = {title: 'DSSD - Resources'}
  
  // authenticate user
  const result = await authCheck(ctx)

  if (result.valid) {
    // render content
    locals.content = await parse('http://api.dssd.team/resources')
    await ctx.render('markdown', locals, true)
  }
})

module.exports = router
