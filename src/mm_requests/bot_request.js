const request = require("request");

const COOKIE = `MMAUTHTOKEN=${process.env.MMAUTHTOKEN}; MMUSERID=${process.env.MMUSERID}; MMCSRF=${process.env.MMCSRF}`;
const USER_ID = process.env.MMUSERID;

class BotRequest {
  constructor(channelId) {
    this.channelId = channelId;
    this.headers = {
      accept: "*/*",
      "accept-language": "en",
      "content-type": "application/json",
      cookie: COOKIE,
      origin: "https://chat.bsscommerce.com",
      priority: "u=1, i",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6834.83 Electron/34.0.1 Safari/537.36 Mattermost/5.11.1",
      "x-csrf-token": process.env.MMCSRF,
      "x-requested-with": "XMLHttpRequest",
    };
  }

  async send({ message = "[Default Bot Message]" }) {
    const options = {
      method: "POST",
      url: "https://chat.bsscommerce.com/api/v4/posts",
      headers: this.headers,
      body: JSON.stringify({
        file_ids: [],
        message: message,
        channel_id: this.channelId,
        root_id: "",
        user_id: USER_ID,
        create_at: 0,
        metadata: {},
        props: {
          disable_group_highlight: true,
        },
        reply_count: 0,
      }),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
  }
}

const TGBotRequest = new BotRequest("ikmohwktbffs5yo47z4mogxnko");
const TSBotRequest = new BotRequest("dijqgcxgrtrdz8ckq4cmuhqixy");
const MyBotRequest = new BotRequest("gwo9wd39dirzdrnkbj5ohe5cyw");

module.exports = { TGBotRequest, TSBotRequest, MyBotRequest };
