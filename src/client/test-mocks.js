const jwtEncode = require('jwt-encode');

jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

const loginExpired = new Date();
loginExpired.setMinutes(loginExpired.getMinutes() + 30);

const loginNotExpired = new Date();
loginNotExpired.setMinutes(loginNotExpired.getMinutes() + 61);

module.exports = {
  LOGIN_DATA: { account: 'test', password: 'test' },
  LOGIN_RESPONSE: {
   data: {
      loginSession: {
        sessionId: jwtEncode({ exp: loginNotExpired.getTime() / 1000 }, ''),
        rfSessionId: 1
      }
    }
  },
  LOGIN_RESPONSE_EXPIRED: {
   data: {
      loginSession: {
        sessionId: jwtEncode({ exp: loginExpired.getTime() / 1000 }, ''),
        rfSessionId: 1
      }
    }
  },
  GETDEVICES_RESPONSE: {
   data: {
     statusInfos: {
       deviceSerial: {
         optionals: {
           lockNum: '{"1":1}'
         }
       }
     },
     deviceInfos: [
     {
       fullSerial: 1,
       name: 'name',
       deviceSerial: 'deviceSerial',
       deviceType: 'type',
       version: 'version'
     }
     ]
   }
  },
  REFRESH_SESSION_IF_NEEDED_RESPONSE: {
    data: {
      sessionInfo: {
        sessionId: jwtEncode({ exp: loginNotExpired }, ''),
        refreshSessionId: 1
      }
    }
  },
  DEVICE: {
    deviceSerial: 1,
    channelNumber: 2,
    lockIndex: 3
  }
}
