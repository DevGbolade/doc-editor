import winston from 'winston';

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

type LogLevelColors = {
  [key in LogLevel]: string;
};

const customColors: LogLevelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

winston.addColors(customColors);

class Logger {
  private logger: winston.Logger;

  constructor(private name: string, private level: LogLevel = 'info') {
    this.logger = winston.createLogger({
      level: this.level,
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.label({ label: this.name }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, label }) => {
          return `${timestamp} [${label}] ${level}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  public log(level: LogLevel, message: string): void {
    this.logger.log(level, message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public print(message: string): void {
    this.logger.verbose(message);
  }
}

export default Logger;
