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
import {
  BrokerController,
  ConnectorController,
  Endpoint,
  EnvironmentControllerInterface,
  IdentityProviderController,
  Instance,
  LogLevel,
} from './../index.js';

export type ScenarioConfiguration = {
  name: string;
  environmentControllerFactory: () => Promise<EnvironmentControllerInterface>;
  defaultConnectorInstanceFactory: (deploymentName: string) => Instance;
  ConnectorControllerType: new (
    hostname: string,
    username: string,
    password: string,
    endpoints: Endpoint[]
  ) => ConnectorController;
  identityManagement:
    | {
        InstanceType: new (
          deploymentName: string,
          username: string,
          password: string
        ) => Instance;
        IdentityProviderControllerType: new () => IdentityProviderController;
      }
    | undefined;
};

export interface ScenarioControllerInterface {
  scenarioConfiguration: ScenarioConfiguration;
  envController: EnvironmentControllerInterface;

  runScenario(scenario: Scenario): Promise<void>;
  log(
    level: LogLevel,
    text: string,
    sourceComponent: string,
    labels: {[key: string]: string}
  ): void;
  startConnector<I extends Instance, C extends ConnectorController>(
    username: string,
    password: string,
    hostname: string,
    Instance?: I,
    ConnectorControllerType?: new (
      hostname: string,
      username: string,
      password: string,
      endpoints: Endpoint[]
    ) => C
  ): Promise<Connector<I, C>>;
  useConnector<I extends Instance, C extends ConnectorController>(
    username: string,
    password: string,
    hostname: string,
    Instance?: I,
    ConnectorControllerType?: new (
      hostname: string,
      username: string,
      password: string,
      endpoints: Endpoint[]
    ) => C
  ): Promise<Connector<I, C>>;
  startBroker<I extends Instance, C extends BrokerController>(
    instance: I,
    controllerType: C
  ): Promise<Broker<I, C>>;
  wait(ms: number): Promise<void>;
  tearDown(): Promise<void>;
}

export interface Scenario {
  run: (scenarioController: ScenarioControllerInterface) => void;
  scenario_name: string;
}

export interface Connector<I extends Instance, C extends ConnectorController> {
  instanceController: I;
  componentController: C;
}

export interface Broker<I extends Instance, C extends BrokerController> {
  instanceController: I;
  componentController: C;
}

export interface IdentityProvider<
  I extends Instance,
  C extends IdentityProviderController
> {
  instanceController: I;
  componentController: C;
}
