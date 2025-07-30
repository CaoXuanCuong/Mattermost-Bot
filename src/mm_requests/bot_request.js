const request = require("request");
class BotRequest {
  constructor(channelId) {
    this.channelId = channelId;
    this.headers = {
      "content-type": "application/json",
    };
  }

  async send({ message = "[Default Bot Message]" }) {
    const options = {
      method: "POST",
      url: "https://mattermost-bot.bsscommerce.com/send",
      headers: this.headers,
      body: JSON.stringify({
        message: message,
        channel_id: this.channelId,
      }),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
  }
}

const MY_CHANNEL_ID = process.env.MY_CHANNEL_ID;

const MMBotRequest = new BotRequest(MY_CHANNEL_ID);

module.exports = { MMBotRequest };
