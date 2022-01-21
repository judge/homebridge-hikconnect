const {
  LOGIN_URL,
  GET_DEVICES_URL,
  REFRESH_SESSION_URL
} = require('./constants');

class HikConnectAPI {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  getLoginUrl() {
    return `${this._baseUrl}${LOGIN_URL}`;
  }

  getDevicesUrl() {
    return `${this._baseUrl}${GET_DEVICES_URL}`;
  }

  getRefreshSessionUrl() {
    return `${this._baseUrl}${REFRESH_SESSION_URL}`;
  }

  getUnlockUrl({ deviceSerial, lockChannel, lockIndex }) {
    return `${this._baseUrl}/v3/devconfig/v1/call/${deviceSerial}/${lockChannel}/remote/unlock?srcId=1&lockId=${lockIndex}&userType=0`;
  }
}

module.exports = HikConnectAPI;
