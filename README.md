# Dollar-backend 汇率查询 API

这个项目提供了一个 API 服务，可以通过 POST 请求查询不同货币的特定类型的汇率。API 使用 `https://srh.bankofchina.com/search/whpj/search_cn.jsp` 来获取最新的汇率信息。

## 功能

1. 接受 POST 请求，并从请求体中读取 `currency` 和 `type` 这两个字段，分别表示希望查询的货币和汇率类型。若没有提供，则默认查询美元的现汇买入价。

2. 使用 `fetch` 函数，向中国银行的官方网站发送 POST 请求，查询指定货币的汇率。

3. 使用 `cheerio` 解析返回的 HTML 文本，从中提取出查询到的汇率信息，并将其作为响应返回。

## 安装

首先需要安装 Node.js，然后运行以下命令来安装项目依赖：

```bash
npm install
```

## 使用

运行以下命令来启动服务：

```bash
node index.js
```

然后，你可以发送 POST 请求到服务端，请求体中可以包含 `currency` 和 `type` 这两个字段，表示你希望查询的货币和汇率类型。例如：

```json
{
  "currency": "美元",
  "type": "现汇买入价"
}
```

服务会返回一个 JSON 对象，其中包含查询到的汇率信息。

注意：本项目仅供学习参考使用，不保证查询结果的准确性。如需获取准确的汇率信息，请直接参考中国银行的官方网站。