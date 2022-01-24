const HikConnectAPI = require('../src/api');
const HikConnectClient = require('../src/client');

(async () => {
	const hikConnectAPI = new HikConnectAPI({ baseUrl: 'http://localhost:8000' })
	const hikConnectClient = new HikConnectClient({ hikConnectAPI });

	const locks = await hikConnectClient.getLocks()
	console.log(locks);
})();
