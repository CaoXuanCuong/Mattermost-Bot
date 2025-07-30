const schedule = require("node-schedule");
const {
  MMBotRequest,
} = require("../mm_requests/bot_request");

const autoRemindReportTasks = async (Request) => {
  const reportTasksMessage = `:alarm_clock: Giờ lành đã điểm, anh chị em, sinh hoạt buồng! @cuongcx_762, @dongdx_1222, @cuonghv_1099, @vanntt_1107, @dungntp1_1221.\n
    Reply vào thread này để báo cáo nha, theo mẫu sau:\n\n

    I. Những task đang làm\n
    1. Update: Storefront - Popup\n
    Link: https://pms.bssgroup.vn/default/viewtaskdetail/SABLPR-3\n
    Tiến độ: 85%\n
    Vấn đề: Không\n
    Dự kiến done: Ngày mai\n

    2. CMS - Customers\n
    Link: https://pms.bssgroup.vn/default/viewtaskdetail/SABLPR-8\n
    Tiến độ: 90%\n
    Vấn đề: Không\n\n

    II. Những task dự kiến làm\n
    Không có`
  ;
  await Request.send({ message: reportTasksMessage });
};

const autoRemindSprintMeeting = async (Request) => {
  const reportTasksMessage = `Buồng mình có lịch gặp mặt sinh hoạt tại lòng 19L lớn lúc 15h45 nha anh chị em @all.\n
    Đề nghị các anh chị @cuongcx_762 chuẩn bị báo cáo tiến độ chung, @huongpt_694 chuẩn bị báo cáo tình hình business, @dongdx_1222, @cuonghv_1099 sẵn sàng demo và @vanntt_1107 update file test tracking!`;
  await Request.send({ message: reportTasksMessage });
};

const Schedule = {
  init: () => {
    const daysOfWeek = [1, 2, 3, 4, 5];
    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 18, minute: 3 },
      () => {
        autoRemindReportTasks(MMBotRequest);
      },
    );
    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: daysOfWeek, hour: 18, minute: 3 },
      () => {
        autoRemindSprintMeeting(MMBotRequest);
      },
    );
  },
};

module.exports = Schedule;
