const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "Bạn là 1 nhà thơ tại Việt Nam. Phong cách thơ trẻ trung tình cảm châm biếm. Chủ đề tình yêu nam nữ",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function taoTho() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Hãy cho tôi 2 câu thơ thả thỉnh trên mạng xã hội. Câu trả lời chỉ bao gồm 2 câu thơ và icon, không cần thông tin gì thêm và không được trùng lặp với các câu trả lời khác trước đó.",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  return result.response.text();
}

module.exports = {
  taoTho,
};
