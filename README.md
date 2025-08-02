# Facebook Conversions API - Node.js

Este servidor envia eventos de conversão para o Facebook via Conversions API.

## Como usar

### 1. Subir no GitHub

Crie um repositório com os arquivos abaixo:
- `server.js`
- `package.json`

### 2. Subir no Render

1. Vá até [https://render.com](https://render.com)
2. Clique em "New Web Service"
3. Escolha seu repositório no GitHub
4. Configure como:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: América do Sul (se disponível)
5. Salve e aguarde a publicação

### 3. Usar na página de obrigado

Use este código na `<head>` ou logo antes do `</body>`:

```html
<script>
  fetch("https://SEU-RENDER-APP.onrender.com/api/conversion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      fbp: localStorage.getItem("_fbp") || "",
      fbclid: new URLSearchParams(window.location.search).get("fbclid") || "",
      user_agent: navigator.userAgent,
      ip_address: "",
      purchase_value: 1.00
    })
  });
</script>
```

Substitua `SEU-RENDER-APP` pelo nome do seu app no Render.

---