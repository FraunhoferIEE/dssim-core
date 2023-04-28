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
import {Representation} from './models/Representation.js';
import {UsagePolicy} from './usagepolicy.js';

export type Artifact = {
  name: string;
  description?: string;
};

export type DatabaseType = 'Postgres' | 'MSSQL' | 'Oracle';

export type Offer = {
  id?: string;
  name: string;
  description?: string;
  keywords?: string[];
  publisher?: string;
  language?: string;
  license?: string;
  sovereign?: string;
  start: Date;
  end: Date;
};

export interface IdentityProviderController {
  getClientList(): unknown;
}

export interface BrokerController {
  doSth(): unknown;
}

export interface ConnectorController {
  initialize(): Promise<void>;
  getDescription(hostname: string): unknown;
  getAllOffers(endPointUrl: string): Promise<
    {
      offerId: string;
      contractOfferId: string;
      assetId: string;
      assetName: string;
    }[]
  >;
  negotiateContract(
    endPointUrl: string,
    offeredRessource: {
      offerId: string;
      contractOfferId: string;
      assetId: string;
      assetName: string;
    }
  ): Promise<{contractId: string}>;
  getArtifactsForAgreement(
    contractAgreementId: string
  ): Promise<{url: string}[]>;
  downloadArtifact(
    artifactUrl: string,
    forceDownload?: boolean
  ): Promise<unknown>;
  transferArtifactsForAgreement(contractAgreementId: string): Promise<void>;
  createValueArtifact(artifact: Artifact, value: string): Promise<string>;
  createHttpEndpointArtifact(
    artifact: Artifact,
    endpointUrl: string,
    mimeType: string,
    apiKey?: {headerKey: string; value: string},
    basicAuth?: {username: string; password: string},
    ressourcePolling?: {
      delay: number;
      period: number;
    }
  ): Promise<string>;
  createDatabaseArtifact(
    artifact: Artifact,
    url: string,
    database: DatabaseType,
    username: string,
    password: string,
    sqlQuery: string
  ): Promise<string>;
  createOfferForArtifact(
    artifactId: string,
    offer: Offer,
    representation: Representation,
    catalog: {name: string; description?: string},
    policy?: UsagePolicy
  ): Promise<unknown>;
  getFirstArtifact<T>(endPointUrl: string): Promise<T>;
  setHttpDataReceiver(url: string): Promise<void>;
}
