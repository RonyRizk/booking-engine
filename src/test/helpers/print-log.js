import { Writable } from "node:stream";
import winston from "winston";
import { forgetPrintRepeats } from "@/lib/printing-log";
import { errorLogger, printLogger } from "@/logger";

/**
 * Captures what the print log really writes: the serialized lines, as they would
 * land in the file, from both of its outputs. Starts with no repeats remembered and
 * `APP_ENV=testing`, where every outcome is written; `restore` puts APP_ENV back.
 *
 * @returns {{ lines: () => string[], entries: () => object[], restore: () => void }}
 */
export const capturePrintLog = () => {
    forgetPrintRepeats();
    const appEnv = process.env.APP_ENV;
    process.env.APP_ENV = "testing";
    const lines = [];
    const stream = new Writable({
        write(chunk, _encoding, done) {
            lines.push(chunk.toString().trim());
            done();
        },
    });
    const attached = [printLogger, errorLogger].map((logger) => {
        const transport = new winston.transports.Stream({ stream });
        logger.add(transport);
        return { logger, transport };
    });
    return {
        lines: () => [...lines],
        entries: () => lines.map((line) => JSON.parse(line)),
        restore: () => {
            attached.forEach(({ logger, transport }) => logger.remove(transport));
            if (appEnv === undefined) delete process.env.APP_ENV;
            else process.env.APP_ENV = appEnv;
        },
    };
};
