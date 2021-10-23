const axios = require('axios');
const md5 = require('md5');
const qs = require('qs');
const jwtDecode = require('jwt-decode');

const {
  BASE_URL,
  LOGIN_URL,
  GET_DEVICES_URL,
  REFRESH_SESSION_URL,
  CLIENT_TYPE,
  FEATURE_CODE,
  LANGUAGE
} = require('./constants');

const DEFAULT_HEADERS = {
  clientType: CLIENT_TYPE,
  lang: LANGUAGE,
  featureCode: FEATURE_CODE
};

class HikConnectClient {

  constructor() {
    this._sessionId = '';
    this._refreshSessionId = '';
    this._loginValidUntil = '';
  }

  async login({ account, password }) {
    try {
      const response = await axios({
        method: 'post',
        url: LOGIN_URL,
        data: this._prepareLoginPayloadData({ account, password }),
        headers: DEFAULT_HEADERS
      });

      this._saveSessionData({
        sessionId: response.data.loginSession.sessionId,
        refreshSessionId: response.data.loginSession.rfSessionId
      });
    } catch (error) {
      throw new Error('Login failed, wrong account or password');
    }
  }

  async getDevices() {
    try {
      const response = await axios({
        method: 'get',
        url: GET_DEVICES_URL,
        headers: Object.assign({}, DEFAULT_HEADERS, { sessionId: this._sessionId })
      });

      return response.data.deviceInfos.map(device => ({
        id: device.fullSerial,
        name: device.name,
        serial: device.deviceSerial,
        type: device.deviceType,
        version: device.version,
        locks: JSON.parse(response.data.statusInfos[device.deviceSerial].optionals.lockNum)
      }));
    } catch (error) {
      throw new Error('Failed to get devices');
    }
  }

  async refreshSessionIfNeeded() {
    if (!this._isNewSessionNeeded(this._loginValidUntil)) {
      return false;
    }

    try {
      const response = await axios({
        method: 'put',
        url: REFRESH_SESSION_URL,
        data: this._prepareRefreshSessionPayloadData(this._refreshSessionId)
      });

      this._saveSessionData({
        sessionId: response.data.sessionInfo.sessionId,
        refreshSessionId: response.data.sessionInfo.refreshSessionId
      });
    } catch (error) {
      throw new Error('Could not refresh session');
    }
  }

  async unlock(deviceSerial, channelNumber, lockIndex = 0) {
    try {
      await axios({
        method: 'put',
        url: `${BASE_URL}/v3/devconfig/v1/call/${deviceSerial}/${channelNumber}/remote/unlock?srcId=1&lockId=${lockIndex}&userType=0`,
        headers: Object.assign({}, DEFAULT_HEADERS, { sessionId: this._sessionId })
      });
    } catch (error) {
      throw new Error(`Unlock failed: ${deviceSerial}/${channelNumber}/${lockIndex}`);
    }
  }

  _isNewSessionNeeded(loginValidUntil) {
    const now = new Date();
    const validUntil = new Date(loginValidUntil * 1000);
    const differenceInHours = Math.abs(validUntil - now) / 36e5;
    return differenceInHours < 1;
  }

  _prepareLoginPayloadData({ account, password }) {
    return qs.stringify({ account, password: md5(password) });
  }

  _prepareRefreshSessionPayloadData(refreshSessionId) {
    return qs.stringify({ refreshSessionId, featureCode: FEATURE_CODE });
  }

  _saveSessionData({ sessionId, refreshSessionId }) {
    this._sessionId = sessionId;
    this._refreshSessionId = refreshSessionId;
    this._loginValidUntil = jwtDecode(sessionId).exp;
  }

}

module.exports = HikConnectClient;
