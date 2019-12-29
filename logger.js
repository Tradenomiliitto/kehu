const winston = require("winston");
const { colorize, combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

const myFormat = printf(info => {
  let { level, message, timestamp, ...rest } = info;
  let error = info.error || info.err;
  if (error instanceof Error) {
    delete rest.error;
    delete rest.err;
    rest.errorStatusCode = error.statusCode;
    rest.errorMessage = error.message;
  }
  return `${timestamp} [${level}]: ${message} ${
    Object.entries(rest).length > 0 ? JSON.stringify(rest) : ""
  }${error && error.stack != null ? `\n${error.stack}` : ""}`;
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp({ format: "HH:mm:ss" }), colorize(), myFormat)
    })
  );
}

module.exports = logger;
