// Set Module
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Configure constant
const port = config.get('port');
const htdocsPath = config.get('htdocsPath');
const morganFormat = config.get('morganFormat');
const logDirPath = config.get('logDirPath');

// Logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${logDirPath}/server-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});

logger.stream = {
  write: message => {
    logger.info(message.trim());
  },
};

// Middleware
const app = express();
app.use(
  morgan(morganFormat, {
    stream: logger.stream,
  })
);
app.use(express.static(`${__dirname}/${htdocsPath}`));

// app.get('/', (req, res) => {
//   console.log(`Hello from the server 😀`);
//   res.send('Hello!');
// });

app.listen(port, () => {
  console.log(`Starting server at port ${port}`);
});
