const LOCK_TIMEOUT = 5 * 1000; // 5 seconds

class HikConnectLockAccessory {

  constructor(platform, accessory) {
    this.accessory = accessory;
    this.log = platform.log;
    this.platform = platform.api.hap;
    this.device = accessory.context.lock;
    this.hikConnectClient = platform.hikConnectClient;
    this.Characteristic = platform.api.hap.Characteristic;

    this.accessory.getService(this.platform.Service.AccessoryInformation)
      .setCharacteristic(this.Characteristic.Name, this.device.name)
      .setCharacteristic(this.Characteristic.Manufacturer, 'Hikvision')
      .setCharacteristic(this.Characteristic.Model, this.device.model)
      .setCharacteristic(this.Characteristic.SerialNumber, this.device.serial)
      .setCharacteristic(this.Characteristic.FirmwareRevision, this.device.firmware);

    this.service = this.accessory.getService(this.platform.Service.LockMechanism) || this.accessory.addService(this.platform.Service.LockMechanism);

    this.service.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.handleLockCurrentStateGet.bind(this));

    this.service.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.handleLockTargetStateGet.bind(this))
      .onSet(this.handleLockTargetStateSet.bind(this));
  }

  handleLockCurrentStateGet() {
    return this.Characteristic.LockCurrentState.SECURED;
  }

  handleLockTargetStateGet() {
    return this.Characteristic.LockCurrentState.SECURED;
  }

  async handleLockTargetStateSet(value) {
    try {
      await this.hikConnectClient.unlock(this.device.serial, this.device.lockChannel, this.device.lockIndex);

      this.service.getCharacteristic(this.Characteristic.LockCurrentState).updateValue(value);
      this.service.getCharacteristic(this.Characteristic.LockTargetState).updateValue(value);

      setTimeout(() => {
        this.service.getCharacteristic(this.Characteristic.LockCurrentState).updateValue(1);
        this.service.getCharacteristic(this.Characteristic.LockTargetState).updateValue(1);
      }, LOCK_TIMEOUT);
    } catch (error) {
      this.log.error('Unlock failed', error);
    }
  }
}

module.exports = HikConnectLockAccessory;