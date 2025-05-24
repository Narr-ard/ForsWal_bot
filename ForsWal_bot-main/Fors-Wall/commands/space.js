const axios = require('axios');
module.exports = {
  name: 'space',
  async execute(message) {
    const res = await axios.get('http://api.open-notify.org/iss-now.json');
    const pos = res.data.iss_position;
    message.channel.send(`🛰 ISS saat ini berada di: Latitude ${pos.latitude}, Longitude ${pos.longitude}`);
  }
};
