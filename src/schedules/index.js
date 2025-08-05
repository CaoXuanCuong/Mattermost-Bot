const schedule = require("node-schedule");
const {
  MMBotRequest,
} = require("../mm_requests/bot_request");

const autoRemindReportTasks = async (Request) => {
  const reportTasksMessage = `:alarm_clock: Giờ lành đã điểm, anh chị em, sinh hoạt buồng! @dongdx_1222, @cuonghv_1099, @vanntt_1107, @dungntp1_1221.\nReply vào thread này để báo cáo nha, theo mẫu sau:\n\nI. Những task đang làm\n1. Update: Storefront - Popup\nLink: https://pms.bssgroup.vn/default/viewtaskdetail/SABLPR-3\nTiến độ: 85%\nVấn đề: Không\nDự kiến done: Ngày mai\n2. CMS - Customers\nLink: https://pms.bssgroup.vn/default/viewtaskdetail/SABLPR-8\nTiến độ: 90%\n Vấn đề: Không\n\nII. Những task dự kiến làm\nKhông có`
  ;
  await Request.send({ message: reportTasksMessage });
};

const autoRemindSprintMeeting = async (Request) => {
  const reportTasksMessage = `:speaking_head_in_silhouette: Buồng mình có lịch gặp mặt sinh hoạt tại lòng 19L lớn lúc 15h50 nha anh chị em @all.\nĐề nghị các anh chị @cuongcx_762 chuẩn bị báo cáo tiến độ chung, @huongpt_694 chuẩn bị báo cáo tình hình business, @vynmk_1189 báo cáo tình hình support khách và @vanntt_1107 update file test tracking!`;
  await Request.send({ message: reportTasksMessage });
};

const Schedule = {
  init: () => {
    const reportTasksDays = [2, 4];
    const sprintMeetingDays = [1];

    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: reportTasksDays, hour: 16, minute: 30 },
      () => {
        autoRemindReportTasks(MMBotRequest);
      },
    );
    schedule.scheduleJob(
      { tz: "Asia/Ho_Chi_Minh", dayOfWeek: sprintMeetingDays, hour: 15, minute: 20 },
      () => {
        autoRemindSprintMeeting(MMBotRequest);
      },
    );
  },
};

module.exports = Schedule;
