const {
  LOGIN_URL,
  GET_DEVICES_URL,
  REFRESH_SESSION_URL
} = require('./constants');

const HikConnectAPI = require('./api');

const testBaseUrl = 'https://localhost';

describe('HikConnectAPI', () => {
  describe('#getLoginUrl', () => {
    it('should return login url', () => {
      const hikConnectAPI = new HikConnectAPI({ baseUrl: testBaseUrl });

      expect(hikConnectAPI.getLoginUrl()).toEqual(`${testBaseUrl}${LOGIN_URL}`);
    });
  });

  describe('#getDevicesUrl', () => {
    it('should return devices url', () => {
      const hikConnectAPI = new HikConnectAPI({ baseUrl: testBaseUrl });

      expect(hikConnectAPI.getDevicesUrl()).toEqual(`${testBaseUrl}${GET_DEVICES_URL}`);
    });
  });

  describe('#getRefreshSessionUrl', () => {
    it('should return refreshSession url', () => {
      const hikConnectAPI = new HikConnectAPI({ baseUrl: testBaseUrl });

      expect(hikConnectAPI.getRefreshSessionUrl()).toEqual(`${testBaseUrl}${REFRESH_SESSION_URL}`);
    });
  });

  describe('#getUnlockUrl', () => {
    it('should return unlock url', () => {
      const hikConnectAPI = new HikConnectAPI({ baseUrl: testBaseUrl });

      const unlockConfig = {
        deviceSerial: 1,
        lockChannel: 2,
        lockIndex: 3
      };

      expect(hikConnectAPI.getUnlockUrl(unlockConfig)).toEqual(`${testBaseUrl}/v3/devconfig/v1/call/${unlockConfig.deviceSerial}/${unlockConfig.lockChannel}/remote/unlock?srcId=1&lockId=${unlockConfig.lockIndex}&userType=0`);
    });
  });
});
