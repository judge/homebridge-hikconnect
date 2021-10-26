const axios = require('axios');
const md5 = require('md5');
const qs = require('qs');

const {
  BASE_URL,
  LOGIN_URL,
  GET_DEVICES_URL,
  REFRESH_SESSION_URL,
  CLIENT_TYPE,
  FEATURE_CODE,
  LANGUAGE
} = require('./constants');

const {
  LOGIN_DATA,
  LOGIN_RESPONSE,
  LOGIN_RESPONSE_EXPIRED,
  GETDEVICES_RESPONSE,
  GETDEVICES_RESPONSE_DEVICE_WITHOUT_LOCK,
  REFRESH_SESSION_IF_NEEDED_RESPONSE,
  DEVICE
} = require('./test-mocks');

const HikConnectClient = require('./');

jest.mock('axios');

describe('HikConnectClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#login', () => {
    it('should call api with post', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.login(LOGIN_DATA);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'post' })
      );
    });

    it('should call api with correct URL', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.login(LOGIN_DATA);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ url: LOGIN_URL })
      );
    });

    it('should call api with correct headers', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.login(LOGIN_DATA);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            clientType: CLIENT_TYPE,
            lang: LANGUAGE,
            featureCode: FEATURE_CODE
          }
        })
      );
    });

    it('should call api with correct data', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.login(LOGIN_DATA);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          data: qs.stringify({ account: LOGIN_DATA.account, password: md5(LOGIN_DATA.password) }),
        })
      );
    });

    it('should throw an Error if login is failed (there is no loginSession in the response)', async () => {
      axios.mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const hikConnectClient = new HikConnectClient();

      await expect(hikConnectClient.login(LOGIN_DATA))
        .rejects
        .toThrow('Login failed, wrong account or password');
    });
  });

  describe('#getDevices', () => {
    it('should call api with get', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(GETDEVICES_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.getDevices();

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'get' })
      );
    });

    it('should call api with correct URL', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(GETDEVICES_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.getDevices();

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ url: GET_DEVICES_URL })
      );
    });

    it('should call api with correct headers', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(GETDEVICES_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.getDevices();

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            sessionId: '',
            clientType: CLIENT_TYPE,
            lang: LANGUAGE,
            featureCode: FEATURE_CODE
          }
        })
      );
    });

    it('should return transformed device data', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(GETDEVICES_RESPONSE));

      const hikConnectClient = new HikConnectClient();
      const results = await hikConnectClient.getDevices();

      expect(results).toStrictEqual(
        [
          {
            id: 1,
            name: 'name',
            serial: 'deviceSerial',
            type: 'type',
            version: 'version',
            locks: { '1': 1 }
          }
        ]
      );
    });

    it('should return only devices with locks', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(GETDEVICES_RESPONSE_DEVICE_WITHOUT_LOCK));

      const hikConnectClient = new HikConnectClient();
      const results = await hikConnectClient.getDevices();

      expect(results).toStrictEqual(
        [
          {
            id: 1,
            name: 'name',
            serial: 'deviceSerialWithLock',
            type: 'type',
            version: 'version',
            locks: { '1': 1 }
          }
        ]
      );
    });

    it('should throw an Error if request is failed', async () => {
      axios.mockImplementationOnce(() => Promise.resolve({ data: {} }));

      const hikConnectClient = new HikConnectClient();

      await expect(hikConnectClient.getDevices())
        .rejects
        .toThrow('Failed to get devices');
    });
  });

  describe('#refreshSessionIfNeeded', () => {
    describe('session is not expired', () => {
      it('should return false', async () => {
        axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

        const hikConnectClient = new HikConnectClient();
        await hikConnectClient.login(LOGIN_DATA);
        const result = hikConnectClient.refreshSessionIfNeeded();

        expect(result).toBe.false;
      });
    });

    describe('session is expired', () => {
      it('should call api with put', async () => {
        axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE_EXPIRED));

        const hikConnectClient = new HikConnectClient();
        await hikConnectClient.login(LOGIN_DATA);

        axios.mockImplementationOnce(() => Promise.resolve(REFRESH_SESSION_IF_NEEDED_RESPONSE));

        hikConnectClient.refreshSessionIfNeeded();

        expect(axios).toHaveBeenNthCalledWith(2,
          expect.objectContaining({ method: 'put' })
        );
      });

      it('should call api with correct URL', async () => {
        axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE_EXPIRED));

        const hikConnectClient = new HikConnectClient();
        await hikConnectClient.login(LOGIN_DATA);

        axios.mockImplementationOnce(() => Promise.resolve(REFRESH_SESSION_IF_NEEDED_RESPONSE));

        hikConnectClient.refreshSessionIfNeeded();

        expect(axios).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ url: REFRESH_SESSION_URL })
        );
      });

      it('should call api with correct data', async () => {
        axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE_EXPIRED));

        const hikConnectClient = new HikConnectClient();
        await hikConnectClient.login(LOGIN_DATA);

        axios.mockImplementationOnce(() => Promise.resolve(REFRESH_SESSION_IF_NEEDED_RESPONSE));

        hikConnectClient.refreshSessionIfNeeded();

        const refreshSessionId = REFRESH_SESSION_IF_NEEDED_RESPONSE.data.sessionInfo.refreshSessionId;

        expect(axios).toHaveBeenNthCalledWith(
          2, 
          expect.objectContaining({
            data: qs.stringify({ refreshSessionId, featureCode: FEATURE_CODE })
          })
        );
      });

      it('should throw an Error if request is failed', async () => {
        axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE_EXPIRED));

        const hikConnectClient = new HikConnectClient();
        await hikConnectClient.login(LOGIN_DATA);

        axios.mockImplementationOnce(() => Promise.resolve({ data: {} }));

        await expect(hikConnectClient.refreshSessionIfNeeded())
          .rejects
          .toThrow('Could not refresh session');
      });
    });
  });

  describe('#unlock', () => {
    it('should call api with put', async () => {
      axios.mockImplementationOnce(() => Promise.resolve({}));

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.unlock();

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'put' })
      );
    });

    it('should call api with correct url', async () => {
      axios.mockImplementationOnce(() => Promise.resolve({}));

      const hikConnectClient = new HikConnectClient();
      const { deviceSerial, channelNumber, lockIndex } = DEVICE;
      await hikConnectClient.unlock(deviceSerial, channelNumber, lockIndex);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${BASE_URL}/v3/devconfig/v1/call/${DEVICE.deviceSerial}/${DEVICE.channelNumber}/remote/unlock?srcId=1&lockId=${DEVICE.lockIndex}&userType=0`
        })
      );
    });

    it('should call api with correct headers', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(LOGIN_RESPONSE));

      const sessionId = LOGIN_RESPONSE.data.loginSession.sessionId;

      const hikConnectClient = new HikConnectClient();
      await hikConnectClient.login(LOGIN_DATA);

      const { deviceSerial, channelNumber, lockIndex } = DEVICE;
      await hikConnectClient.unlock(deviceSerial, channelNumber, lockIndex);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            clientType: CLIENT_TYPE,
            lang: LANGUAGE,
            featureCode: FEATURE_CODE,
            sessionId
          }
        })
      );
    });

    it('should throw an Error if unlock', async () => {
      axios.mockImplementationOnce(() => Promise.rejects());

      const hikConnectClient = new HikConnectClient();

      const { deviceSerial, channelNumber, lockIndex } = DEVICE;

      await expect(hikConnectClient.unlock(deviceSerial, channelNumber, lockIndex))
        .rejects
        .toThrow(`Unlock failed: ${deviceSerial}/${channelNumber}/${lockIndex}`);
    });
  });
});
