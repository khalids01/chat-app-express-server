import logger from "pino";
import dayjs from "dayjs";
import pretty from "pino-pretty";
const stream = pretty({
  colorize: true,
});
const log = logger({
  level: 'info',
  timestamp: () => `,"time":"${dayjs().format("ddd, MMM D, YYYY h:mm A")}"`,
});

export default log;
