# Homebridge HikConnect

A Homebridge plugin to communicate with Hikvision smart doorbells via Hik-Connect cloud and allows lock to be unlocked. It exposes doorbell locks as a lock accessories to Homekit.

<a href="https://www.buymeacoffee.com/judge" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>


## Features

- For now only unlock a lock connected to Hikvision outdoor station.

This plugin does not add Camera entity with live view from Hikvision stations (yet).

## Troubleshooting

### Unable to login

Please make sure you added `account` and `password` fields to the config. There is a user interface for adding this info if you are using Homebridge, for HOOBS you need to adjust the configuration manually. 

If you added the correct account and password and you still cannot login, you can try to set the API URL to one of the following URL:
- https://ius.hik-connect.com
- https://www.hik-connectru.com