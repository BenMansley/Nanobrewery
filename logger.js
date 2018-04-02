const winston = require("winston");

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

const timeStamp = () => new Date().toISOString();
const formatter = options => (
  `${options.timestamp()} [${options.level.toUpperCase().padEnd(5)}] ${options.message ? options.message : ""}`);

let transports = [];

if (process.env.NODE_ENV !== "test") {
  transports.push(new winston.transports.Console({ timestamp: timeStamp, formatter: formatter }));
}

const logger = new winston.Logger({
  levels: levels,
  transports: transports
});

module.exports = logger;
