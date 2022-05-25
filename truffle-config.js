module.exports = {
  	networks: {
      	covidApp: {
           	host: "127.0.0.1",
           	port: 7545,
           	network_id: "5777" 
      	}
	},
	solc: {
		optimizer: {
		  enabled : true,
		  runs: 200
		}
	}
};