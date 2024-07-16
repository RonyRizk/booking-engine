import winston from "winston";
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: "logs/next-app.log",
        }),
        new winston.transports.Console()
    ],
});
const errorLogger = winston.createLogger({
    level: "error",
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: "logs/next-errors.log",
        }),
        new winston.transports.Console()
    ],
});
const originalConsoleError = console.error;
console.error = (...args) => {
    originalConsoleError(...args);
    errorLogger.error(...args);
};

const originalConsole = console.log;
console.log = (...args) => {
    originalConsole(...args);
    logger.info(...args);
};
export { logger, errorLogger };