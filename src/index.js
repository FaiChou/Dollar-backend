const cheerio = require('cheerio');

export default {
  async fetch(request, env, ctx) {
    const {pathname} = new URL(request.url)
    const currency = pathname === '/' ? '美元' : pathname;
    const data = await getExchangeRate(currency);
    const json = JSON.stringify({data}, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

async function getExchangeRate(currency) {
  const url = 'https://srh.bankofchina.com/search/whpj/search_cn.jsp';
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `erectDate=&nothing=&pjname=${currency}`
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const table = $('div.BOC_main.publish table');
  const headers = table.find('tr:first-child th');
  let targetIndex = -1;
  headers.each((index, element) => {
      if ($(element).text().includes('现汇买入价')) {
          targetIndex = index;
          return false; // Break the loop
      }
  });
  if (targetIndex >= 0) {
      const targetTd = table.find(`tr:nth-child(2) td:nth-child(${targetIndex + 1})`);
      return targetTd.text().trim();
  } else {
      return ""
  }
}
