import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';

interface Date {
  year: number;
  month: number;
  day: number;
}

interface Time {
  hours: number;
  minutes: number;
}

interface LogRecord {
  originalDateTime: moment.Moment;
  date: Date;
  time: Time;
  action: string;
}

function parseLogEntry(logEntry: string): LogRecord {

  const [
    date,
    time,
    ...action // tslint:disable-line 
  ] = logEntry.replace(/[\[\]]/g, '').split(' ');

  const [ year, month, day ] = date.split('-').map((i) => parseInt(i, 10));
  const [ hours, minutes ] = time.split(':').map((i) => parseInt(i, 10));

  return {
    action: action.join(' '),
    date: { year, month, day },
    originalDateTime: moment(`${date} ${time}`),
    time: { hours, minutes },
  };
}

function logSort(a: LogRecord, b: LogRecord) {
  return a.originalDateTime.isBefore(b.originalDateTime)
    ? -1
    : 1;
}

interface ScheduleAccumulator {
  [key: string ]: any;
  currentGuard: string;
  schedule: {
    [key: string]: LogRecord[];
  };
}

function run() {
  const stream = fs.createReadStream(path.join(__dirname, 'test.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = chunk
      .toString()
      .split('\n')
      .map(parseLogEntry)
      .sort(logSort)
      .reduce((acc: ScheduleAccumulator, record: LogRecord) => {
        let currentGuard = acc.currentGuard;
        if (record.action.startsWith('Guard')) {
          const [ _, guardNumber ] = record.action.split(' ').map((s) => s.replace('#', ''));

          currentGuard = guardNumber;
        }

        const guardSchedule = acc.schedule[currentGuard];

        return {
          currentGuard,
          schedule: {
            ...acc.schedule,
            [currentGuard as string]: guardSchedule
              ? guardSchedule.concat(record)
              : [record],
          },
        };
      }, {
        currentGuard: '',
        schedule: {},
      });

    console.log(data);
  });
}

run();
