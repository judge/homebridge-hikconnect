const axios = require('axios');
const md5 = require('md5');
const qs = require('qs');
const jwtDecode = require('jwt-decode');

const {
  BASE_URL,
  CLIENT_TYPE,
  FEATURE_CODE,
  LANGUAGE
} = require('./constants');

const HikConnectAPI = require('./api');

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
    this._api = new HikConnectAPI({ baseUrl: BASE_URL });
  }

  async login({ account, password }) {
    try {
      const response = await axios({
        method: 'post',
        url: this._api.getLoginUrl(),
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

  async getLocks() {
    try {
      const response = await axios({
        method: 'get',
        url: this._api.getDevicesUrl(),
        headers: Object.assign({}, DEFAULT_HEADERS, { sessionId: this._sessionId })
      });

      return this._transformDevicesToLocks(response);
    } catch (error) {
      throw new Error('Failed to get locks');
    }
  }

  async refreshSessionIfNeeded() {
    if (!this._isNewSessionNeeded(this._loginValidUntil)) {
      return false;
    }

    try {
      const response = await axios({
        method: 'put',
        url: this._api.getRefreshSessionUrl(),
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

  async unlock(deviceSerial, lockChannel, lockIndex) {
    try {
      await axios({
        method: 'put',
        url: this._api.getUnlockUrl({ deviceSerial, lockChannel, lockIndex }),
        headers: Object.assign({}, DEFAULT_HEADERS, { sessionId: this._sessionId })
      });
    } catch (error) {
      throw new Error(`Unlock failed: ${deviceSerial}/${lockChannel}/${lockIndex}`);
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

  _transformDevicesToLocks(response) {
    return response.data.deviceInfos
      .filter(device => response.data.statusInfos[device.deviceSerial].optionals.lockNum)
      .reduce((locks, device) => {
        const deviceLocks = JSON.parse(response.data.statusInfos[device.deviceSerial].optionals.lockNum);
        for (const [lockChannel, numberOfLocks] of Object.entries(deviceLocks)) {
          [...Array(numberOfLocks)].forEach((_, lockIndex) => {
            locks.push({
              id: device.fullSerial,
              name: `${device.name}/${lockChannel}/${lockIndex}`,
              serial: device.deviceSerial,
              type: device.deviceType,
              version: device.version,
              lockChannel: parseInt(lockChannel),
              lockIndex
            });
          });
        }
        return locks;
      }, []);
  }

}

module.exports = HikConnectClient;
