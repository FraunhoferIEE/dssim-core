/*
 * Copyright 2023 Fraunhofer IEE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *       Michel Otto - initial implementation
 *
 */
import {createLogger, Logger, transports} from 'winston';
import LokiTransport from 'winston-loki';
import {LogLevel} from '../index.js';

const loggerOptions = (lokiAddress?: string, logLevel?: string) => {
  console.log('generating logging option with loki url $lokiAdress');
  return {
    //format: format.combine(format.timestamp(), format.json()),
    exitOnError: true,
    transports: lokiAddress
      ? [
          new LokiTransport({
            host: lokiAddress,
            json: true,
            labels: {app: 'ScenarioController'},
            replaceTimestamp: true,
            batching: true,
            interval: 1,
            handleExceptions: true,
            handleRejections: true,
            level: logLevel ?? 'info',
            timeout: 10000,
            onConnectionError: error => {
              console.error('Sending log to Loki failed.', error);
            },
          }),
          new transports.Console({
            level: logLevel ?? 'debug',
          }),
        ]
      : [
          new transports.Console({
            level: logLevel ?? 'debug',
          }),
        ],
  };
};

export class DssimLogger {
  private static instance: DssimLogger;
  private static logger: Logger;

  private constructor() {
    DssimLogger.logger = createLogger(loggerOptions());
  }

  public addLokiOutput(lokiAddress: string) {
    DssimLogger.logger = createLogger(loggerOptions(lokiAddress));
  }

  public static getInstance(): DssimLogger {
    if (!DssimLogger.instance) {
      DssimLogger.instance = new DssimLogger();
    }

    return DssimLogger.instance;
  }

  log(
    level: LogLevel,
    text: string,
    sourceComponent: string,
    labels: {[key: string]: string}
  ): void {
    labels['source'] = sourceComponent;
    DssimLogger.logger.log(level, {
      message: text,
      labels: labels,
    });
  }
}
