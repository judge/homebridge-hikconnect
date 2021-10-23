const BASE_URL = 'https://api.hik-connect.com';

module.exports = {
  BASE_URL,
  LOGIN_URL: `${BASE_URL}/v3/users/login/v2`,
  GET_DEVICES_URL: `${BASE_URL}/v3/userdevices/v1/devices/pagelist?groupId=-1&limit=100&offset=0&filter=TIME_PLAN,CONNECTION,SWITCH,STATUS,STATUS_EXT,WIFI,NODISTURB,P2P,KMS,HIDDNS`,
  REFRESH_SESSION_URL: `${BASE_URL}/v3/apigateway/login`,
  CLIENT_TYPE: '55',
  FEATURE_CODE: 'deadbeef', // any non-empty hex string work
  LANGUAGE: 'en-US'
}