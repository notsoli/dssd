const Router = require('koa-router')
const router = new Router()
const { authSign } = require('../private/auth')
const db = require('../private/db')

router.post('/auth', async ctx => {
  // store request params
  const body = ctx.request.body

  // retrieve password
  const response = await db.get("http://api.dssd.team/access")

  // check password and create jwt
  let jwt
  if (body.password == response.data.accessKey) {
    jwt = await authSign()
  }

  if (jwt != null) {
    //7,200,000
    ctx.cookies.set('auth', jwt, {
      httpOnly: true, SameSite: 'Strict', expires: new Date(7200000 + Date.now())
    })
    ctx.body = {status: 200}
  } else {
    ctx.body = {status: 401}
  }
})

module.exports = router