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
export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export type MemoryUnit =
  | 'E'
  | 'P'
  | 'T'
  | 'G'
  | 'M'
  | 'k'
  | 'Ei'
  | 'Pi'
  | 'Ti'
  | 'Gi'
  | 'Mi'
  | 'Ki';

export type BandwidthUnit =
  | 'bit'
  | 'kbit'
  | 'mbit'
  | 'gbit'
  | 'tbit'
  | 'bps'
  | 'kbps'
  | 'mbps'
  | 'gbps'
  | 'tbps'
  | 'kibit'
  | 'mibit'
  | 'gibit'
  | 'tibit'
  | 'kibps'
  | 'mibps'
  | 'gibps'
  | 'tibps';

export type CpuUnit = 'cpuunit' | 'milicpu';

export type TimeUnits = 's' | 'ms' | 'us';

export interface Instance {
  /*
  bandwidth: bandwidth or rate limit for the container
  delay: length of time packets will be delayed
  lossRate: percentage loss probability to the packets outgoing from the chosen network interface
  duplicateRate: percentage value of network packets to be duplicated before queueing
  corruptionRate: Corruption: emulation of random noise introducing an error in a random position for a chosen percent of packets

  Important: all Rates are given in percent (0-100)
  */
  setNetworkControl(config: {
    bandwidth?: {
      value: number;
      unit: BandwidthUnit;
    };
    delay?: {
      value: number;
      unit: TimeUnits;
    };
    lossRate?: number;
    duplicateRate?: number;
    corruptionRate?: number;
  }): Promise<void>;
  //remove all traffic control settings
  clearAllNetworkLimitations(): Promise<void>;

  /*Limits and requests for memory are measured in bytes. You can express memory as a plain integer or as a
  fixed-point number using one of these quantity units: E, P, T, G, M, k.
  You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi, Mi, Ki.*/
  readonly memoryLimit?: {value: number; unit: MemoryUnit};

  /*
  Limits and requests for CPU resources are measured in cpu units. In Kubernetes, 1 CPU unit is equivalent to
  1 physical CPU core, or 1 virtual core, depending on whether the node is a physical host or a virtual machine
  running inside a physical machine.
  For CPU resource units, the quantity expression 0.1 is equivalent to the expression 100m, which can be read as "one hundred millicpu".
  */
  readonly cpuLimit?: {value: number; unit: CpuUnit};

  readonly healthCheckUrl: string | undefined;
  readonly endpoints: Endpoint[];
  hostname?: string;
  endPointUrl?: string;
  deploymentName?: string;
}

export type ContainerImage = {
  image: string;
  pullSecret?: {
    [registrydomain: string]: {
      username: string;
      password: string;
    };
  };
};

export type ReadinessProbe = {
  failureThreshold: number;
  httpGet: {
    path: string;
    port: number;
    scheme: string;
  };
  initialDelaySeconds: number;
  periodSeconds: number;
  successThreshold: number;
  timeoutSeconds: number;
};

export interface EnvironmentControllerInterface {
  deployInstance<T extends Instance>(instance: T): Promise<T>;

  deployContainerizedService(
    name: string,
    image: ContainerImage,
    endpoints: Endpoint[],
    readinessProbe?: ReadinessProbe
  ): Promise<Instance>;

  tearDown(): void;
}

export type Endpoint = {name: string; path: string; port: number};
