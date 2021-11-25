const Router = require('koa-router')
const router = new Router()
const { authCheck } = require('../private/auth')
const db = require('../private/db')

router.get('/results', async ctx => {
  const locals = {title: 'DSSD - Results'}
  
  // authenticate user
  const result = await authCheck(ctx)

  if (result.valid) {
    // retrieve meets
    const response = await db.get('http://api.dssd.team/meets?_sort=year:ASC,opponent:ASC')

    // generate meet structure
    const meets = {}

    // sort meets
    response.data.forEach(meet => {
      if (meets[meet.year] == undefined) {
        meets[meet.year] = []
      }

      meets[meet.year].push(meet)
    })

    // construct and render page
    locals.meets = meets
    await ctx.render('results', locals, true)
  }
})

module.exports = router