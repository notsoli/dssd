const jwt = require('jsonwebtoken')
const util = require('util')
const crypto = require('crypto')

// allow functions to be used with async
const signPromise = util.promisify(jwt.sign)
const verifyPromise = util.promisify(jwt.verify)

// generate private key
const privateKey = crypto.randomBytes(32).toString('hex');

// sign jwt
async function authSign() {
  const token = await signPromise({
    exp: Math.floor(Date.now() / 1000) + (120 * 60)
  }, privateKey)
  return token
}

// verify auth cookie and render authentication
async function authCheck(ctx, locals) {
  // get auth cookie and check if it exists
  authCookie = ctx.cookies.get('auth')
  if (!authCookie) {
    await ctx.render('auth', locals, true)
    return {valid: false, data: undefined}
  }

  try {
    // attempt to verify jwt
    const result = await verifyPromise(authCookie, privateKey)
    return {valid: true, data: result}
  } catch(e) {
    // catches invalid tokens
    await ctx.render('auth', locals, true)
    return {valid: false, data: undefined}
  }
}

// exports
module.exports.authSign = authSign
module.exports.authCheck = authCheck