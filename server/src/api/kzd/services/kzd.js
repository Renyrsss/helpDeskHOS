'use strict';

/**
 * kzd service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kzd.kzd');
