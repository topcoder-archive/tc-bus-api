/**
 * Service to find email template placeholders name.
 */

const Joi = require('joi')
const config = require('config')
const request = require('superagent')
const cache = require('memory-cache')
const tcCoreLibAuth = require('tc-core-library-js').auth
const logger = require('../common/logger')
const m2m = tcCoreLibAuth.m2m(config)

/**
 * Get email template placeholders with a verified cached Keycloak credential.
 * @param {String} name Email template name.
 * Token failures are sanitized, logged, and preserve the existing empty-cache result.
 *
 * @returns {Array} list with email template placeholders name
 */
async function getAllPlaceholders (name) {
  const cachedData = cache.get(`placeholders-${name}`)
  if (cachedData == null) {
    try {
      const token = await m2m.getMachineToken()
      const data = await request
        .get(`${config.TC_EMAIL_SERVICE_URL}/templates/${name}`)
        .set('accept', 'json')
        .set('authorization', `Bearer ${token}`)
      const parsedData = JSON.parse(data.text)

      cache.put(`placeholders-${name}`, parsedData, config.TC_EMAIL_SERVICE_CACHE_PERIOD)

      return parsedData
    } catch (err) {
      logger.error(`Error generating m2m token: ${err.message}`)
    }
  }

  return cachedData
}

getAllPlaceholders.schema = {
  name: Joi.string().required()
}

/**
 * Clear template placeholder cache.
 */
async function clearAllPlaceholders () {
  cache.clear()
}

module.exports = {
  getAllPlaceholders,
  clearAllPlaceholders
}
