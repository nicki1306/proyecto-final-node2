import winston from "winston";
import config from "../config.js";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} ${level}: ${message}`;
                })
            )
        }),
        new winston.transports.File({
            filename: "./logs/errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} ${level}: ${message}`;
                })
            )
        }),
        new winston.transports.File({
            filename: "./logs/errors.log",
            level: "error",
            maxFiles: 30,
            maxsize: 5 * 1024 * 1024,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = config.MODE === "production" ? prodLogger : devLogger;
    req.logger.http(
        `${req.method} ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    next();
};