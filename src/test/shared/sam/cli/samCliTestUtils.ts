/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import * as assert from 'assert'
import { SpawnOptions } from 'child_process'
import { SamCliProcessInvoker } from '../../../../shared/sam/cli/samCliInvokerUtils'
import { ChildProcessResult } from '../../../../shared/utilities/childProcess'

export class MockSamCliProcessInvoker implements SamCliProcessInvoker {
    public constructor(private readonly validateArgs: (args: string[]) => void) {}

    public invoke(options: SpawnOptions, ...args: string[]): Promise<ChildProcessResult>
    public invoke(...args: string[]): Promise<ChildProcessResult>
    public async invoke(first: SpawnOptions | string, ...rest: string[]): Promise<ChildProcessResult> {
        const args: string[] = typeof first === 'string' ? [first, ...rest] : rest
        this.validateArgs(args)

        return ({
            exitCode: 0
        } as any) as ChildProcessResult
    }
}

export function assertArgsContainArgument(args: any[], argOfInterest: string, expectedArgValue: string) {
    const argPos = args.indexOf(argOfInterest)
    assert.notStrictEqual(argPos, -1, `Expected arg '${argOfInterest}' was not found`)
    assert.ok(args.length >= argPos + 2, `Args does not contain a value for '${argOfInterest}'`)
    assert.strictEqual(args[argPos + 1], expectedArgValue, `Arg '${argOfInterest}' did not have expected value`)
}

export function assertArgIsPresent(args: any[], argOfInterest: string) {
    assert.notStrictEqual(args.indexOf(argOfInterest), -1, `Expected '${argOfInterest}' arg`)
}

export function assertArgNotPresent(args: any[], argOfInterest: string) {
    assert.strictEqual(args.indexOf(argOfInterest), -1, `Did not expect '${argOfInterest}' arg`)
}
