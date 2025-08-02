const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/purchase', async (req, res) => {
  const { user_data, custom_data, event_name, event_time, action_source, event_id, event_source_url } = req.body;

  const payload = {
    data: [
      {
        event_name: event_name || 'Purchase',
        event_time: event_time || Math.floor(Date.now() / 1000),
        event_source_url: event_source_url,
        user_data: {
          client_user_agent: user_data?.client_user_agent,
          fbp: user_data?.fbp,
          client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          fbclid: user_data?.fbclid, // O fbclid será enviado dentro de user_data
        },
        custom_data: {
          currency: custom_data?.currency || 'BRL',
          value: custom_data?.value || 1.00,
        },
        action_source: action_source || 'website',
        event_id: event_id,
      }
    ],
    test_event_code: null,
  };

  const PIXEL_ID = '1124756639573111';
  const ACCESS_TOKEN = 'EAAKSZCfKLHRkBPAWRqy9KF4S8nCr2UUvdKyBw0PfKtn2dI5Q35BehgXfrxERkdPJnRBBV68EBrEiRZAAbZBxOz2ipC7CFGRpmxfOzZA03OFi3ZCtxlj9RErceV6u7gyFgjG9AcVOHPgsLsLrrphJOyl3yaVmwqvwPkvxtPHodZCvTAthZClsrAaXq6EMlEupTtGtAZDZD';

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      payload
    );
    res.status(200).send({ success: true, response: response.data });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send({ success: false, error: error.response?.data });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
