/**
 * The default configuration.
 */
module.exports = {
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT ? process.env.KAFKA_CLIENT_CERT.replace('\\n', '\n') : null,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY ? process.env.KAFKA_CLIENT_CERT_KEY.replace('\\n', '\n') : null,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || '3000',
  AUTH_SECRET: process.env.AUTH_SECRET || process.env.JWT_TOKEN_SECRET,
  VALID_ISSUERS: process.env.VALID_ISSUERS || '[]',
  TC_EMAIL_SERVICE_URL: process.env.TC_EMAIL_SERVICE_URL,
  TC_EMAIL_SERVICE_CACHE_PERIOD: process.env.TC_EMAIL_SERVICE_CACHE_PERIOD || (3600 * 1000),

  M2M_PROVIDER: process.env.M2M_PROVIDER,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  KEYCLOAK_AUDIENCE: process.env.KEYCLOAK_AUDIENCE,
  KEYCLOAK_TOKEN_URL: process.env.KEYCLOAK_TOKEN_URL,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_SCOPE: process.env.KEYCLOAK_SCOPE,
  SCOPES: {
    'writeBusApi': 'write:bus_api',
    'readBusTopics': 'read:bus_topics'
  }
}
