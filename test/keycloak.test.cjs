const assert = require('node:assert/strict')
const { generateKeyPairSync, sign, createHmac } = require('node:crypto')
const { test } = require('node:test')
const nock = require('nock')
const issuer = 'https://legacy-bus.test/realms/m2m'
Object.assign(process.env, {
  M2M_PROVIDER: 'keycloak', KEYCLOAK_ISSUER: issuer, KEYCLOAK_AUDIENCE: 'https://api.test',
  KEYCLOAK_TOKEN_URL: 'https://legacy-bus.test/m2m/token', KEYCLOAK_CLIENT_ID: 'legacy-bus-test',
  KEYCLOAK_CLIENT_SECRET: 'synthetic-secret', KEYCLOAK_SCOPE: 'read:bus_topics',
  AUTH_SECRET: 'synthetic-member-secret', VALID_ISSUERS: '["https://member.test"]',
  AUTH_USER_AUDIENCES: '["member-api"]', TC_EMAIL_SERVICE_URL: 'https://templates.test', LOG_LEVEL: 'error'
})
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
/** Sign isolated member/service JWT fixtures; changes exercise rejection boundaries. */
function token (changes = {}, member = false) {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify(member ? { alg: 'HS256' } : { alg: 'RS256', kid: 'bus' })).toString('base64url')
  const claims = member ? { iss: 'https://member.test', aud: 'member-api', userId: 123, roles: ['administrator'], handle: 'fixture' }
    : { iss: issuer, aud: 'https://api.test', sub: 'service-bus', azp: 'legacy-bus-test', gty: 'client-credentials', scope: 'read:bus_topics' }
  const payload = Buffer.from(JSON.stringify({ ...claims, iat: now, exp: now + 900, ...changes })).toString('base64url')
  const input = `${header}.${payload}`
  return `${input}.${member ? createHmac('sha256', 'synthetic-member-secret').update(input).digest('base64url') : sign('RSA-SHA256', Buffer.from(input), privateKey).toString('base64url')}`
}
nock(issuer).persist().get('/protocol/openid-connect/certs').reply(200, { keys: [{ ...publicKey.export({ format: 'jwk' }), kid: 'bus', alg: 'RS256', use: 'sig' }] })
test('actual Swagger security requires exact service grants, including HEAD topics', async () => {
  const fs = require('node:fs'); const http = require('node:http'); const yaml = require('js-yaml')
  const spec = yaml.safeLoad(fs.readFileSync('api/swagger.yaml', 'utf8'))
  const middleware = await new Promise(resolve => require('swagger-tools').initializeMiddleware(spec, resolve))
  const app = require('connect')()
  app.use(middleware.swaggerMetadata())
  app.use(middleware.swaggerSecurity({ Bearer: require('../service/AuthService')() }))
  app.use((req, res) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ principal: req.swagger.params.authUser })) })
  app.use((error, req, res, next) => { res.statusCode = error.statusCode || 500; res.end('denied') })
  const server = http.createServer(app).listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve))
  const base = `http://127.0.0.1:${server.address().port}/v5/bus`
  try {
    let response = await fetch(base + '/topics', { headers: { authorization: 'Bearer ' + token() } })
    assert.equal(response.status, 200); const principal = (await response.json()).principal; assert.equal(principal.kind, 'service'); assert.equal(principal.userId, undefined); assert.deepEqual(principal.roles, [])
    response = await fetch(base + '/topics', { method: 'HEAD', headers: { authorization: 'Bearer ' + token({ scope: 'write:bus_api' }) } }); assert.equal(response.status, 403)
    response = await fetch(base + '/events', { method: 'POST', headers: { authorization: 'Bearer ' + token() } }); assert.equal(response.status, 403)
    response = await fetch(base + '/events', { method: 'POST', headers: { authorization: 'Bearer ' + token({ scope: 'write:bus_api' }) } }); assert.equal(response.status, 200)
    response = await fetch(base + '/events', { method: 'POST', headers: { authorization: 'Bearer ' + token({ scope: 'write:bus_api' }, true) } }); assert.equal(response.status, 403)
    response = await fetch(base + '/services', { headers: { authorization: 'Bearer ' + token() } }); assert.equal(response.status, 403)
    response = await fetch(base + '/services', { headers: { authorization: 'Bearer ' + token({}, true) } }); assert.equal(response.status, 200)
    response = await fetch(base + '/topics', { headers: { authorization: 'Bearer ' + token({ aud: 'wrong' }) } }); assert.equal(response.status, 401)
    response = await fetch(base + '/topics', { headers: { authorization: 'Bearer ' + token({ roles: ['administrator'] }) } }); assert.equal(response.status, 401)
  } finally { await new Promise(resolve => server.close(resolve)) }
})
test('legacy verification helper delegates to core and members cannot satisfy service scopes', async () => {
  const helper = require('../common/helper')
  const service = await helper.verifyJwtToken(token()); assert.equal(service.kind, 'service')
  assert.doesNotThrow(() => helper.verifyTokenScope({ swagger: { params: { authUser: service } } }, 'read:bus_topics'))
  const member = await helper.verifyJwtToken(token({ scope: 'read:bus_topics' }, true))
  assert.throws(() => helper.verifyTokenScope({ swagger: { params: { authUser: member } } }, 'read:bus_topics'), error => error.statusCode === 403)
  await assert.rejects(helper.verifyJwtToken(token({ aud: 'wrong' })))
})
test('placeholder lookup uses verified cached Keycloak tokens before HTTP transport', async () => {
  const { getAllPlaceholders, clearAllPlaceholders } = require('../service/PlaceholdersService')
  const jwt = token(); const endpoint = nock('https://legacy-bus.test').post('/m2m/token').reply(200, { access_token: jwt, expires_in: 900 })
  const target = nock('https://templates.test', { reqheaders: { authorization: `Bearer ${jwt}` } }).get('/templates/fixture').twice().reply(200, { placeholders: ['name'] })
  assert.deepEqual(await getAllPlaceholders('fixture'), { placeholders: ['name'] }); await clearAllPlaceholders()
  assert.deepEqual(await getAllPlaceholders('fixture'), { placeholders: ['name'] })
  assert.equal(endpoint.isDone(), true); assert.equal(target.isDone(), true); await clearAllPlaceholders()
})
