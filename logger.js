const winston = require("winston");
const { colorize, combine, timestamp, printf, errors } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: true }), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

const myFormat = printf(info => {
  let { level, message, timestamp, stack, ...rest } = info;
  let error = info.error || info.err;
  if (error instanceof Error) {
    delete rest.error;
    delete rest.err;
    rest.errorStatusCode = error.statusCode;
    message += "\n" + error.message;
    stack = error.stack;
  }
  return `${timestamp} [${level}]: ${message} ${
    Object.entries(rest).length > 0 && JSON.stringify(rest) !== "{}"
      ? JSON.stringify(rest)
      : ""
  }${stack != null ? `\n${stack}` : ""}`;
});

logger.add(
  new winston.transports.Console({
    format: combine(timestamp({ format: "HH:mm:ss" }), colorize(), myFormat)
  })
);

module.exports = logger;
