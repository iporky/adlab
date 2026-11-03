/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */

import TargetingOptionsServices from '../services/targetingServices.js';

const LOG_TAG = 'controller.snapchat.targetingOptions';

class TargetingsController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.targetingOptionsServices = TargetingOptionsServices;
  }

  /**
   * Retrieves all targeting options.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */
  async getTargetingOptions(targetingOpts) {
    const logMessage = `${LOG_TAG}.getTargetingOptions, pathSegments: ${JSON.stringify(targetingOpts.type)}`;
    console.log(logMessage);
    return this.targetingOptionsServices.getTargetingOptions(targetingOpts.type);
  }
}

export default TargetingsController;
