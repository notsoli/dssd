const Router = require('koa-router')
const router = new Router()
const { authCheck } = require('../private/auth')
const db = require('../private/db')

router.get('/results/:year/:meet', async ctx => {
  const locals = {title: 'DSSD - Meet'}
  
  // authenticate user
  const result = await authCheck(ctx)

  if (result.valid) {
    // retrieve meets
    const query = `http://api.dssd.team/meets?year=${ctx.params.year}&opponent_contains=${ctx.params.meet}`
    const response = await db.get(query)

    // check if response is valid
    const meets = response.data
    if (meets.length > 1) {
      ctx.throw(400, "Query matched multiple meets.")
    } else if (meets.length == 0) {
      ctx.throw(400, "Query matched no meets.")
    }

    locals.meet = meets[0]
    await ctx.render('meet', locals, true)
  }
})

module.exports = router