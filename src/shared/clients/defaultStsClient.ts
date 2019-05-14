/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import { STS } from 'aws-sdk'
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service'
import { ext } from '../extensionGlobals'
import { StsClient } from './stsClient'

export class DefaultStsClient implements StsClient {

    private readonly _credentials: ServiceConfigurationOptions | undefined

    public constructor (
        public readonly regionCode: string,
        credentials?: { accessKeyId: string, secretAccessKey: string }
    ) {
        if (credentials) {
            this._credentials = credentials
        }
    }

    public async getCallerIdentity(): Promise<STS.GetCallerIdentityResponse> {
        const sdkClient = await this.createSdkClient()

        const response = await sdkClient.getCallerIdentity().promise()

        return response
    }

    private async createSdkClient(): Promise<STS> {
        return await ext.sdkClientBuilder.createAndConfigureServiceClient(
            (options) => new STS(options),
            this._credentials,
            this.regionCode
        )
    }
}
