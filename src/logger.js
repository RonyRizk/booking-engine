
import winston from "winston";
const { combine, timestamp, json, printf } = winston.format;
import 'winston-daily-rotate-file';

const MAX_SIZE = '200m' // rotate when file hits 200mb
const MAX_FILES = '2d'  // delete files older than 2 days
const IS_TEST = process.env.NODE_ENV === 'test' // `bun test` must not write to the real log files

const apiInfoFormat = printf(({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        route: meta.route || 'unknown',
        method: meta.method || 'unknown',
        params: meta.params || {},
        searchParams: meta.searchParams || {},
        body: meta.body || {},
        userAgent: meta.userAgent,
        ip: meta.ip,
        error: meta.error ? {
            name: meta.error.name,
            message: meta.error.message,
            stack: meta.error.stack,
            cause: meta.error.cause
        } : message,
        ...meta
    });
});
const apiErrorFormat = printf(({ level, message, timestamp, ...meta }) => {
    // return JSON.stringify({
    //     timestamp,
    //     level,
    //     message,
    //     route: meta.route || 'unknown',
    //     method: meta.method || 'unknown',
    //     params: meta.params || {},
    //     searchParams: meta.searchParams || {},
    //     body: meta.body || {},
    //     userAgent: meta.userAgent,
    //     ip: meta.ip,
    //     error: meta.error ? {
    //         name: meta.error.name,
    //         message: meta.error.message,
    //         stack: meta.error.stack,
    //         cause: meta.error.cause
    //     } : message,
    //     ...meta
    // });
    return `[${timestamp}] [${meta.route || "unknown"}] [${meta.method}]: ${JSON.stringify({
        message,
        params: meta.params || {},
        searchParams: meta.searchParams || {},
        body: meta.body || {},
        userAgent: meta.userAgent,
        ip: meta.ip,
        error: meta.error ? {
            name: meta.error.name,
            message: meta.error.message,
            stack: meta.error.stack,
            cause: meta.error.cause
        } : message,
        ...meta
    })}`
});

// const logger = winston.createLogger({
//     level: "info",
//     format: combine(timestamp(), json()),
//     transports: [
//         new winston.transports.File({
//             filename: "logs/next-app.log",
//         }),
//         new winston.transports.Console()
//     ],
// });

const errorLogger = winston.createLogger({
    level: "error",
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: "logs/next-errors-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: MAX_SIZE,
            maxFiles: MAX_FILES,
            zippedArchive: true,
            silent: IS_TEST,
        }),
        new winston.transports.Console({ silent: IS_TEST })
    ],
});

const apiErrorLogger = winston.createLogger({
    level: "error",
    format: combine(timestamp(), apiErrorFormat),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: "logs/next-api-errors-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: MAX_SIZE,
            maxFiles: MAX_FILES,
            zippedArchive: true,
        }),
        new winston.transports.Console({
            format: combine(timestamp(), json())
        })
    ],
});

// One line per print outcome that isn't a failure; failures go to errorLogger.
const printLogger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: "logs/next-prints-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
            silent: IS_TEST,
        }),
    ],
});
// const apiInfoLogger = winston.createLogger({
//     level: "info",
//     format: combine(timestamp(), apiInfoFormat),
//     transports: [
//         new winston.transports.File({
//             filename: "logs/next-api-info.log",
//         }),
//         new winston.transports.Console({
//             format: combine(timestamp(), json()) // Console uses JSON for readability
//         })
//     ],
// });

// Helper function to extract request context
const getRequestContext = (req) => {
    const url = new URL(req.url);
    const route = url.pathname;
    const searchParams = Object.fromEntries(url.searchParams);
    const headers = new Headers(req.headers)
    const authHeader = headers.get("authorization");
    return {
        route,
        method: req.method,
        searchParams,
        userAgent: req.headers.get('user-agent'),
        ticket: authHeader,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    };
};

const logError = (error, additionalContext = {}) => {
    errorLogger.error({
        message: error.message || 'Error',
        error: error instanceof Error ? error : new Error(String(error)),
        ...additionalContext
    });
};

const logApiError = (error, req, additionalContext = {}) => {
    const requestContext = getRequestContext(req);

    apiErrorLogger.error({
        message: error.message || 'API Error',
        error: error instanceof Error ? error : new Error(String(error)),
        ...requestContext,
        ...additionalContext
    });
};
// const logApiInfo = (req, additionalContext = {}) => {
//     const requestContext = getRequestContext(req);
//     apiInfoLogger.info({
//         ...requestContext,
//         ...additionalContext
//     });
// };

// const originalConsoleError = console.error;
// console.error = (...args) => {
//     originalConsoleError(...args);
//     errorLogger.error(...args);
// };

// const originalConsole = console.log;
// console.log = (...args) => {
//     originalConsole(...args);
//     logger.info(...args);
// };

export {
    // logger,
    errorLogger,
    apiErrorLogger,
    printLogger,
    // apiInfoLogger,
    logApiError,
    logError,
    getRequestContext,
    // logApiInfo
};
