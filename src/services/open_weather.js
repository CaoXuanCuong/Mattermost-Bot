const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = "Hanoi";
const UNITS = "metric"; // Sử dụng độ C thay vì độ F

async function getCurrentWeather() {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: CITY,
          appid: API_KEY,
          units: UNITS,
        },
      },
    );

    const data = response.data;
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      feels_like: data.main.feels_like,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thời tiết hiện tại:", error.message);
    throw error;
  }
}

async function getForecast() {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: CITY,
          appid: API_KEY,
          units: UNITS,
        },
      },
    );

    // OpenWeather API trả về dự báo theo mỗi 3 giờ, chúng ta sẽ nhóm theo ngày
    const data = response.data;
    const dailyForecasts = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split("T")[0];

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          temps: [],
          descriptions: [],
          date: day,
        };
      }

      dailyForecasts[day].temps.push(item.main.temp);
      dailyForecasts[day].descriptions.push(item.weather[0].description);
    });

    // Tính nhiệt độ trung bình và tìm mô tả phổ biến nhất cho mỗi ngày
    const forecasts = Object.values(dailyForecasts).map((day) => {
      const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;

      // Tìm mô tả phổ biến nhất
      const descriptionCount = {};
      day.descriptions.forEach((desc) => {
        descriptionCount[desc] = (descriptionCount[desc] || 0) + 1;
      });

      let mostCommonDescription = "";
      let maxCount = 0;

      for (const [desc, count] of Object.entries(descriptionCount)) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonDescription = desc;
        }
      }

      return {
        date: day.date,
        avgTemp: avgTemp.toFixed(1),
        description: mostCommonDescription,
      };
    });

    return forecasts.slice(0, 7); // Chỉ trả về 7 ngày
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dự báo:", error.message);
    throw error;
  }
}

async function detectAbnormalWeather(currentWeather, forecast) {
  // Định nghĩa các ngưỡng để phát hiện thời tiết bất thường
  const thresholds = {
    highTemp: 35, // Nhiệt độ cao bất thường (°C)
    lowTemp: 10, // Nhiệt độ thấp bất thường (°C)
    highWind: 10, // Gió mạnh (m/s)
    tempDifference: 8, // Chênh lệch nhiệt độ lớn giữa các ngày liên tiếp (°C)
  };

  let abnormalConditions = [];

  // Kiểm tra thời tiết hiện tại
  if (currentWeather.temperature > thresholds.highTemp) {
    abnormalConditions.push(
      `Nhiệt độ cao bất thường: ${currentWeather.temperature}°C`,
    );
  }

  if (currentWeather.temperature < thresholds.lowTemp) {
    abnormalConditions.push(
      `Nhiệt độ thấp bất thường: ${currentWeather.temperature}°C`,
    );
  }

  if (currentWeather.windSpeed > thresholds.highWind) {
    abnormalConditions.push(`Gió mạnh: ${currentWeather.windSpeed} m/s`);
  }

  // Kiểm tra sự chênh lệch nhiệt độ trong dự báo
  for (let i = 1; i < forecast.length; i++) {
    const tempDiff = Math.abs(
      parseFloat(forecast[i].avgTemp) - parseFloat(forecast[i - 1].avgTemp),
    );
    if (tempDiff > thresholds.tempDifference) {
      abnormalConditions.push(
        `Chênh lệch nhiệt độ lớn giữa ${forecast[i - 1].date} và ${forecast[i].date}: ${tempDiff.toFixed(1)}°C`,
      );
    }
  }

  // Kiểm tra từ khóa thời tiết đặc biệt trong mô tả
  const severeWeatherKeywords = [
    "bão",
    "storm",
    "mưa lớn",
    "heavy rain",
    "lũ lụt",
    "flood",
    "thunderstorm",
    "dông",
  ];

  [currentWeather, ...forecast].forEach((weather) => {
    const description = weather.description || "";
    severeWeatherKeywords.forEach((keyword) => {
      if (description.toLowerCase().includes(keyword)) {
        const date = weather.date ? `vào ngày ${weather.date}` : "hiện tại";
        abnormalConditions.push(`Có thể có ${keyword} ${date}`);
      }
    });
  });

  return abnormalConditions;
}

async function getWeatherReport() {
  try {
    const current = await getCurrentWeather();
    const forecast = await getForecast();
    const abnormalConditions = await detectAbnormalWeather(current, forecast);

    // Tạo báo cáo
    let report = `[BOT]\n\n 
        🌤️ THỜI TIẾT HÀ NỘI 🌤️\n\n`;

    // Thời tiết hiện tại
    report += `HIỆN TẠI:\n`;
    report += `Nhiệt độ: ${current.temperature}°C (cảm giác như ${current.feels_like}°C)\n`;
    report += `Độ ẩm: ${current.humidity}%\n`;
    report += `Mô tả: ${current.description}\n`;
    report += `Tốc độ gió: ${current.windSpeed} m/s\n\n`;

    // Dự báo 7 ngày
    report += `DỰ BÁO 7 NGÀY TỚI:\n`;
    forecast.forEach((day) => {
      report += `- ${day.date}: ${day.avgTemp}°C, ${day.description}\n`;
    });

    // Thông báo bất thường (nếu có)
    if (abnormalConditions.length > 0) {
      report += `\nCẢNH BÁO THỜI TIẾT:\n`;
      abnormalConditions.forEach((condition) => {
        report += `- ${condition}\n`;
      });
    } else {
      report += `\nKhông có điều kiện thời tiết bất thường nào được phát hiện.\n`;
    }

    return report;
  } catch (error) {
    return `Đã xảy ra lỗi khi lấy dữ liệu thời tiết: ${error.message}`;
  }
}

module.exports = { getWeatherReport };
