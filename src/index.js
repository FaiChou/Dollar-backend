const cheerio = require('cheerio');

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(`Method ${request.method} not allowed.`, {
        status: 405,
        headers: {
          Allow: "POST",
        },
      });
    }
    const reqBody = await readRequestBody(request);
    const currency = reqBody.currency || "美元"
    const type = reqBody.type || "现汇买入价"
    const data = await getExchangeRate(currency, type);
    const json = JSON.stringify({data}, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

async function readRequestBody(request) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    return await request.json();
  } else if (contentType.includes("application/text")) {
    return request.text();
  } else if (contentType.includes("text/html")) {
    return request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return "a file";
  }
}


async function getExchangeRate(currency, type = "现汇买入价") {
  const url = 'https://srh.bankofchina.com/search/whpj/search_cn.jsp';
  const body = "erectDate=&nothing=&pjname=" + encodeURIComponent(currency);
  console.log(body)
  const response = await fetch(url, {
      body,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const table = $('div.BOC_main.publish table');
  const headers = table.find('tr:first-child th');
  let targetIndex = -1;
  headers.each((index, element) => {
      if ($(element).text().includes(type)) {
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
