const puppeteer = require("puppeteer");

function convertToMarkdown(data) {
  let markdown = `### 📊 Bảng Giá Vàng Bán Lẻ\n\n`;
  markdown += `| Loại Vàng | Mua vào (triệu VND/lượng) | Bán ra (triệu VND/lượng) |\n`;
  markdown += `|-----------|-----------------|-----------------|\n`;

  data.forEach((item) => {
    markdown += `| **${item.type}** | ${item.buy} | ${item.sell} |\n`;
  });

  markdown += `\n📌 **Lưu ý:** Giá vàng có thể thay đổi theo thời gian.\n`;
  return markdown;
}

const GoldService = {
  getPrice: async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://doji.vn/bang-gia-vang/");

    await page.waitForSelector("._table");

    const data = await page.evaluate(() => {
      // Select the second table
      const secondTable = document.querySelectorAll("._table")[1];
      // Extract data from the second table
      const types = Array.from(
        secondTable.querySelectorAll("._taxonomy ._block"),
      ).map((block) => block.textContent.trim());
      const buyPrices = Array.from(
        secondTable.querySelectorAll("._buy ._block"),
      ).map((block) => block.textContent.trim());
      const sellPrices = Array.from(
        secondTable.querySelectorAll("._Sell ._block"),
      ).map((block) => block.textContent.trim());

      // Extract updatedAt from the specified class
      const updatedAt = secondTable
        .querySelector("._desc")
        .textContent.trim()
        .replace("Cập nhập lúc:", "")
        .trim();

      const data = types.map((type, index) => ({
        type,
        buy: buyPrices[index],
        sell: sellPrices[index],
      }));

      data.pop();

      return {
        updatedAt,
        data,
      };
    });
    await browser.close();
    return convertToMarkdown(data.data);
  },
};

module.exports = GoldService;
