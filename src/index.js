const HikConnectClient = require('./client');
const HikConnectLockAccessory = require('./accessory');

const PLUGIN_NAME = 'homebridge-hikconnect';
const PLATFORM_NAME = 'HikConnect';

const REFRESH_SESSION_INTERVAL = 1 * 60000; // 30 minutes

class HikConnectPlatform {

  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.hikConnectClient = new HikConnectClient();
    this.accessories = [];

    api.on('didFinishLaunching', this.discoverDevices.bind(this));
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }

  async discoverDevices() {
    try {
      await this._loginToHikConnect();
      const devices = await this.hikConnectClient.getDevices();
      const locks = this._transformDevicesToLocks(devices);
      this._registerAccessories(locks);
      setInterval(() => this.hikConnectClient.refreshSessionIfNeeded(), REFRESH_SESSION_INTERVAL);
    } catch (error) {
      this.log.error(error);
    }
  }

  async _loginToHikConnect() {
    const { account, password } = this.config;

    if (!account || !password) {
      throw new Error(`${PLATFORM_NAME} needs account and password specified in config`);
    }

    try {
      await this.hikConnectClient.login({ account, password });
    } catch (error) {
      throw new Error(error);
    }
  }

  _registerAccessories(locks) {
    for (const lock of locks) {
      const uuid = this.api.hap.uuid.generate(lock.name);
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        new HikConnectLockAccessory(this, existingAccessory);
      } else {
        const accessory = new this.api.platformAccessory(lock.name, uuid);
        accessory.context.lock = lock;
        new HikConnectLockAccessory(this, accessory);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }

  _transformDevicesToLocks(devices) {
    return devices.map(device => {
      return Object.keys(device.locks).map(lockChannel => {
        return {
          name: `${device.name}/${lockChannel}`,
          channelNumber: lockChannel,
          serial: device.serial,
          model: device.type,
          firmware: device.version
        };
      })
    }).flat();
  }

}

module.exports = api => {
  api.registerPlatform(PLATFORM_NAME, HikConnectPlatform);
};