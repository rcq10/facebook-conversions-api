const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/conversion', async (req, res) => {
  const {
    event_name,
    event_time,
    event_source_url,
    fbp,
    fbclid,
    user_agent,
    ip_address,
    purchase_value
  } = req.body;

  const payload = {
    data: [
      {
        event_name: event_name,
        event_time: event_time,
        event_source_url: event_source_url,
        user_data: {
          client_user_agent: user_agent,
          fbp: fbp,
          fbc: fbclid,
          client_ip_address: ip_address,
        },
        custom_data: {
          currency: "BRL",
          value: purchase_value
        },
        action_source: "website"
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://graph.facebook.com/v19.0/1124756639573111/events?access_token=EAAKSZCfKLHRkBPNrZB4j2loUnxDSj3Pwii1yc0PHnQUZB7JX0i0eL557MP75Y5WIpwgI2m5OcfTvXNbCvPd4875Id3ZBmu38xdAOlTKdMWCyWYzGZAwq0lyMWUSPCojKxnRgLZBoLDgJuh7Cvcg4Ku514MYIK2CZBTusaBJfn7Rxh8uRNNXtdxnZCPWmxxLJTsjkqAZDZD',
      payload
    );
    res.status(200).send({ success: true, response: response.data });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});