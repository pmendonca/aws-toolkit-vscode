/*!
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import * as immutable from 'immutable'
import * as actions from '../../actions/lambda/regions'

export function regions(
    state: immutable.Map<string, any> = getInitialRegionsState(),
    action: actions.RegionsAction | actions.RegionAction
) {
    switch (action.type) {
        case 'FETCH_REGIONS_START':
            return state
                .setIn(['info', 'fetching'], true)
                .setIn(['info', 'fetchErrorMessage'], undefined)
        case 'FETCH_REGIONS_SUCCESS': {
            const successAction = action as actions.FetchRegionsSuccess

            state = state
                .setIn(['info', 'initialFetchComplete'], true)
                .setIn(['info', 'fetching'], false)
                .setIn(['info', 'fetchErrorMessage'], undefined)

            // Remove regions that no longer exist.
            const stateRegions = state.get('regions') as immutable.Map<string, string>
            for (const regionCode of stateRegions.keySeq()) {
                if (!successAction.regions.keySeq().contains(regionCode)) {
                    state = state.deleteIn(['regions', regionCode])
                }
            }

            // Add or update regions that exist.
            for (const regionCode of successAction.regions.keySeq()) {
                const keyPath = ['regions', regionCode]
                const regionState = state.getIn(keyPath) as immutable.Map<string, any>
                state = state.setIn(keyPath, region(
                    regionState.mergeIn(['name'], successAction.regions.get(regionCode)),
                    action
                ))
            }

            return state
        }
        case 'FETCH_REGIONS_FAILURE': {
            const failureAction = action as actions.FetchRegionsFailure

            return state
                .setIn(['info', 'initialFetchComplete'], true)
                .setIn(['info', 'fetching'], false)
                .setIn(['info', 'fetchErrorMessage'], failureAction.message)
        }
        case 'FETCH_REGION_START':
        case 'FETCH_REGION_SUCCESS':
        case 'FETCH_REGION_FAILURE': {
            const regionAction = action as actions.RegionAction
            const keyPath = [ 'regions', regionAction.region ]

            return state.setIn(
                keyPath,
                region(state.getIn(keyPath) as immutable.Map<string, any>, regionAction)
            )
        }
        default:
            return state
    }
}

function getInitialRegionsState(): immutable.Map<string, any> {
    return immutable.fromJS({
        info: {
            initialFetchComplete: false,
            fetching: false,
            fetchErrorMessage: undefined
        },
        regions: {}
    }) as immutable.Map<string, any>
}

function region(
    state: immutable.Map<string, any> = getInitialRegionState(),
    action: actions.RegionAction | actions.RegionsAction
): immutable.Map<string, any> {
    switch (action.type) {
        case 'FETCH_REGION_START':
            return state
                .setIn(['info', 'fetching'], true)
                .setIn(['info', 'fetchErrorMessage'], undefined)
        case 'FETCH_REGION_SUCCESS':
            const successAction = action as actions.FetchRegionSuccess

            return state
                .setIn(['info', 'initialFetchComplete'], true)
                .setIn(['info', 'fetching'], false)
                .setIn(['info', 'fetchErrorMessage'], undefined)
                .set('functions', successAction.functions)
        case 'FETCH_REGION_FAILURE':
            const failureAction = action as actions.FetchRegionFailure

            return state
                .setIn(['info', 'initialFetchComplete'], true)
                .setIn(['info', 'fetching'], false)
                .setIn(['info', 'fetchErrorMessage'], failureAction.message)
        default:
            return state
    }
}

function getInitialRegionState(): immutable.Map<string, any> {
    return immutable.fromJS({
        info: {
            initialFetchComplete: false,
            fetching: false,
            fetchErrorMessage: undefined
        },
        code: undefined,
        name: undefined,
        functions: []
    }) as immutable.Map<string, any>
}
