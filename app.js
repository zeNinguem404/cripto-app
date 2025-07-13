const symbols = {
  'BTCUSDT': { binance: 'BTCUSDT', coingecko: 'bitcoin' },
  'BTCBRL': { binance: 'BTCBRL', coingecko: 'bitcoin' },
  'USDTBRL': { binance: 'USD-BRL', coingecko: 'tether' }
};

async function getPrice(symbol, source = 'binance') {
  if (source === 'binance') {
    if (symbol === 'USD-BRL') {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL');
      const data = await res.json();
      return parseFloat(data.price);
    }
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const data = await res.json();
    return parseFloat(data.price);
  }
}

async function getVariation(symbol, period) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${symbols[symbol].coingecko}`);
  const data = await res.json();
  let pct = 0;
  switch (period) {
    case '1h': pct = data.market_data.price_change_percentage_1h_in_currency.usd; break;
    case '24h': pct = data.market_data.price_change_percentage_24h_in_currency.usd; break;
    case '7d': pct = data.market_data.price_change_percentage_7d_in_currency.usd; break;
    case '30d': pct = data.market_data.price_change_percentage_30d_in_currency.usd; break;
    case '1y': pct = data.market_data.price_change_percentage_1y_in_currency.usd; break;
    case 'all': pct = data.market_data.ath_change_percentage.usd; break;
  }
  return pct.toFixed(2);
}

async function updatePrices() {
  const period = document.getElementById("variation-period").value;

  const btcusdt = await getPrice('BTCUSDT');
  const btcbrl = await getPrice('BTCBRL');
  const usdtbrl = await getPrice('USD-BRL');

  document.getElementById("btc-usdt").textContent = `$${btcusdt.toFixed(2)}`;
  document.getElementById("btc-brl").textContent = `R$ ${btcbrl.toFixed(2)}`;
  document.getElementById("usdt-brl").textContent = `R$ ${usdtbrl.toFixed(2)}`;

  const btcVar = await getVariation('BTCUSDT', period);
  const brlVar = await getVariation('BTCBRL', period);
  const usdtVar = await getVariation('USDTBRL', period);

  document.getElementById("btc-usdt-var").textContent = `${btcVar}%`;
  document.getElementById("btc-brl-var").textContent = `${brlVar}%`;
  document.getElementById("usdt-brl-var").textContent = `${usdtVar}%`;

  // Cor
  document.getElementById("btc-usdt-var").className = (btcVar >= 0 ? 'variation up' : 'variation down');
  document.getElementById("btc-brl-var").className = (brlVar >= 0 ? 'variation up' : 'variation down');
  document.getElementById("usdt-brl-var").className = (usdtVar >= 0 ? 'variation up' : 'variation down');
}

document.getElementById("variation-period").addEventListener("change", updatePrices);

updatePrices();
setInterval(updatePrices, 30000);
