
import winston from "winston";
const { combine, timestamp, json, printf } = winston.format;

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

const apiErrorLogger = winston.createLogger({
    level: "error",
    format: combine(timestamp(), apiErrorFormat),
    transports: [
        new winston.transports.File({
            filename: "logs/next-api-errors.log",
        }),
        new winston.transports.Console({
            format: combine(timestamp(), json()) // Console uses JSON for readability
        })
    ],
});

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

const logApiError = (error, req, additionalContext = {}) => {
    const requestContext = getRequestContext(req);

    apiErrorLogger.error({
        message: error.message || 'API Error',
        error: error instanceof Error ? error : new Error(String(error)),
        ...requestContext,
        ...additionalContext
    });
};

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

export { logger, errorLogger, apiErrorLogger, logApiError, getRequestContext };
