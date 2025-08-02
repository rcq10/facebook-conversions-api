const express = require('express');
const bodyParser = require('body-parser'); // Mantive o seu, sem problemas.
const axios = require('axios');
const cors = require('cors');

const app = express();

// --- VERIFICAÇÃO DAS VARIÁVEIS DE AMBIENTE ---
// Este log vai nos dizer se o Render está lendo suas chaves corretamente.
console.log('--- Iniciando Servidor ---');
console.log('Verificando variável FB_PIXEL_ID:', process.env.FB_PIXEL_ID ? '✅ Carregada' : '❌ NÃO ENCONTRADA');
console.log('Verificando variável FB_ACCESS_TOKEN:', process.env.FB_ACCESS_TOKEN ? '✅ Carregada' : '❌ NÃO ENCONTRADA');
console.log('---------------------------');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota /purchase, como no seu código original
app.post('/purchase', async (req, res) => {
  console.log('LOG: Requisição recebida em /purchase');
  const { event_source_url, fbp, fbclid, user_agent } = req.body;

  const PIXEL_ID = process.env.FB_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

  // Se as variáveis não foram carregadas, retorna um erro claro.
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error('ERRO CRÍTICO: Variáveis de ambiente FB_PIXEL_ID ou FB_ACCESS_TOKEN não estão configuradas no Render.');
    return res.status(500).json({ status: 'error', message: 'Configuração do servidor incompleta.' });
  }
  
  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event_source_url,
        user_data: {
          client_ip_address: req.ip,
          client_user_agent: user_agent,
          fbp: fbp || undefined,
          fbc: fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined,
        },
        custom_data: {
          currency: 'BRL',
          value: 1.00
        }
      }
    ],
  };

  try {
    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    await axios.post(url, payload);
    console.log('LOG: Evento enviado para o Facebook com SUCESSO.');
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('ERRO: Falha ao enviar evento para o Facebook.', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error' });
  }
});

app.get('/', (req, res) => {
  res.send('API está online!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`LOG: Servidor iniciado na porta ${PORT}`);
});
