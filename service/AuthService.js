const config = require('config')
const { createValidator, hasScopes } = require('tc-core-library-js').auth

/** Create the Swagger security handler using shared-core JWT validation.
 * Takes no arguments; reads explicit Keycloak/member trust from configuration.
 * @returns {Function} Handler receiving request, security definition, bearer value and callback.
 * @throws {TypeError} Invalid provider configuration at initialization.
 * The handler reports sanitized 401 errors for invalid tokens and 403 for denied
 * scopes. Scoped Bus operations are service-only; unscoped legacy catalog stubs
 * remain member-only. No member ID/role/scope inference is performed here.
 */
module.exports = function () {
  const validator = createValidator(config)
  return async function (req, authOrSecDef, scopesOrApiKey, callback) {
    let principal
    try {
      const match = typeof scopesOrApiKey === 'string' ? /^Bearer ([^\s]+)$/i.exec(scopesOrApiKey) : null
      if (!match) throw new Error('Missing bearer token')
      principal = await validator.verify(match[1])
    } catch (error) {
      delete req.swagger.params.authUser
      const failure = new Error('Invalid or expired token')
      failure.statusCode = 401
      callback(failure)
      return
    }
    const required = req.swagger.operation && req.swagger.operation['x-required-scope']
    if ((required && !hasScopes(principal, [required])) || (!required && principal.kind === 'service')) {
      const failure = new Error('Insufficient token scope')
      failure.statusCode = 403
      callback(failure)
      return
    }
    req.swagger.params.authUser = principal
    callback()
  }
}
