const schedule = require("node-schedule");
const {
  MMBotRequest,
} = require("../mm_requests/bot_request");

const autoRemindEndOfWorkDay = async (Request) => {
  const message = `[BOT] Test`;
  await Request.send({ message });
};

const Schedule = {
  init: () => {
    const daysOfWeek = [1, 2, 3, 4, 5];
    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 17, minute: 52 },
      () => {
        autoRemindEndOfWorkDay(MMBotRequest);
      },
    );
  },
};

module.exports = Schedule;
