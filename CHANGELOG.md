# Change Log

## v1.3.2

* Added debug logging of the response from hik-connect

You can enable debug mode of Homebridge in the config UI.

## v1.3.1
* Add donation option

## v1.3.0

* Support for ignoring locks by their name

A custom `ignored_locks` array can be set in the config to ignore locks you don't use.

## v1.2.1

* Add server error messages for client

## v1.2.0

* Support custom API URL

Custom API URL can be defined in the config to support Russia (and other if there are more countries with different URL).

## v1.1.1

### Fixes

* Fix Firmware and Model characteristics

## v1.1.0

### Changes

* Support multiple locks on the same lock channel

Due to this change, I had to rename the locks appending the lock channel for consistency. So if you already installed and used this plugin then this version will create new lock accessory/accessories for you. Please clear your accessory cache in Homebridge Settings / Remove Single Cached Accessory / <remove your old lock(s)>

## v1.0.1

### Fixes

* Do not expose devices with no locks

## v1.0.0

### stable release
