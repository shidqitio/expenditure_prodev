const loggerConfig = {
  appenders: {
    expenditure: { type: "file", filename: "./src/logs/logger.log", pattern: "yyyy-MM-dd", compress: true },
  },
  categories: {
    default: { appenders: ["expenditure"], level: "debug" },
  },
};

module.exports = { loggerConfig };
