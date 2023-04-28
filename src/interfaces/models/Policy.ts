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
import {Duty} from './Duty.js';
import {Permission} from './Permission.js';
import {Prohibition} from './Prohibition.js';

export type Policy = {
  uid?: string;
  '@type'?: {'@policytype': 'set' | 'offer' | 'contract'};
  assignee?: string;
  assigner?: string;
  extensibleProperties?: Record<string, unknown>;
  inheritsFrom?: string;
  obligations?: Array<Duty>;
  permissions?: Array<Permission>;
  prohibitions?: Array<Prohibition>;
  target?: string;
};
