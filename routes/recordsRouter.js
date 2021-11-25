const Router = require('koa-router')
const router = new Router()
const { authCheck } = require('../private/auth')
const db = require('../private/db')

router.get('/records', async ctx => {
  const locals = {title: 'DSSD - Records'}
  
  // authenticate user
  const result = await authCheck(ctx)

  if (result.valid) {
    // retrieve meets
    const response = await db.get("http://api.dssd.team/records")

    // check if response is valid
    const data = response.data

    locals.data = data
    await ctx.render('records', locals, true)
  }
})

module.exports = router