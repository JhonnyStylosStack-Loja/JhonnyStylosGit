const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, payer } = req.body;
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: 'BRL'
        })),
        payer: { name: payer.name, email: payer.email },
        back_urls: {
          success: 'https://ecommecerteste.vercel.app/checkout.html?status=success',
          failure: 'https://ecommecerteste.vercel.app/checkout.html?status=failure',
          pending: 'https://ecommecerteste.vercel.app/checkout.html?status=pending'
        },
        auto_return: 'approved'
      }
    });
    return res.status(200).json({
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  } catch (error) {
    console.error('Erro MP:', error);
    return res.status(500).json({ error: error.message });
  }
}
