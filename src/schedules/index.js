const schedule = require("node-schedule");
const { getWeatherReport } = require("../services/open_weather");
const {
  TGBotRequest,
  TSBotRequest,
  MyBotRequest,
} = require("../mm_requests/bot_request");
const GoldService = require("../services/gold");
const { taoTho } = require("../services/gemini");

const autoSendWeatherReport = async (Request) => {
  const message = await getWeatherReport();
  await Request.send({ message });
};

const autoRemindEndOfWorkDay = async (Request) => {
  const message = `[BOT]\n 🕔 **CẢ NHÀ ƠI!**\n📢 *Hết giờ làm việc rồi!*\n🧹 Nhớ **sắp xếp** và **dọn dẹp** lại vị trí ngồi nhé!\n👟 Xếp **dép** gọn gàng trước khi về nha!`;
  await Request.send({ message });
};

const autoSendPrice = async (Request) => {
  const message = await GoldService.getPrice();
  await Request.send({ message });
};

const autoSendHaveLunch = async (Request) => {
  const message = `[BOT]\n # 🍱 THÔNG BÁO GIỜ ĂN TRƯA 🍱

    Chào mọi người,

    Đã đến giờ nghỉ trưa! Mời tất cả mọi người:

    - Tạm dừng công việc đang làm
    - Di chuyển sang block Team C để lấy đồ ăn

    Chúc mọi người ăn ngon miệng! 😊`;
  await Request.send({ message });
};

const sendAfternoonShiftNotification = async (Request) => {
  const message = `[BOT]\n # ⏰ THÔNG BÁO GIỜ LÀM VIỆC CA CHIỀU ⏰

Chào mọi người,

Thời gian nghỉ trưa đã kết thúc, đã đến giờ bắt đầu ca làm việc buổi chiều.

Mời tất cả mọi người quay trở lại vị trí làm việc và tiếp tục công việc.

Chúc mọi người có một buổi chiều làm việc hiệu quả!`;
  await Request.send({ message });
};

const autoSendTho = async (Request) => {
  const tho = await taoTho();
  const message = `${tho}`;
  await Request.send({ message });
};

const Schedule = {
  init: () => {
    const daysOfWeek = [1, 2, 3, 4, 5];
    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 8, minute: 0 },
      () => {
        autoSendPrice(TGBotRequest);
        autoSendPrice(TSBotRequest);
      },
    );

    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 8, minute: 15 },
      () => {
        autoSendWeatherReport(TGBotRequest);
        autoSendWeatherReport(TSBotRequest);
      },
    );

    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 11, minute: 45 },
      () => {
        autoSendHaveLunch(TGBotRequest);
        autoSendHaveLunch(TSBotRequest);
      },
    );

    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 13, minute: 15 },
      () => {
        sendAfternoonShiftNotification(TGBotRequest);
        sendAfternoonShiftNotification(TSBotRequest);
      },
    );

    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 17, minute: 45 },
      () => {
        autoRemindEndOfWorkDay(TGBotRequest);
        autoRemindEndOfWorkDay(TSBotRequest);
      },
    );

    schedule.scheduleJob(
      {
        tz: "Asia/Ho_Chi_Minh",
        dayOfWeek: daysOfWeek,
        hour: new schedule.Range(8, 17, 2),
        minute: 0,
      },
      () => {
        autoSendTho(TGBotRequest);
      },
    );
  },
};

module.exports = Schedule;
