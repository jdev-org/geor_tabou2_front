import * as Rx from 'rxjs';
import { CONTROL_NAME } from '../constants';

import { generalInfoFormatSelector } from '@mapstore/selectors/mapInfo';

import { updateUserPlugin } from '@mapstore/actions/context';

import {
    LOAD_FEATURE_INFO,
    FEATURE_INFO_CLICK,
    closeIdentify,
    changeMapInfoFormat
} from "@mapstore/actions/mapInfo";
import { TOGGLE_CONTROL } from '@mapstore/actions/controls';
import { isTabou2Activate, defaultInfoFormat, getTabouResponse } from '@ext/selectors/tabou2';
import { loadTabouFeatureInfo, setDefaultInfoFormat, setMainActiveTab } from '@ext/actions/tabou2';

/**
 * Catch GFI response on identify load event and close identify if Tabou2 identify tabs is selected
 * TODO: take showIdentify pluginCfg param into account
 * @param {*} action$
 * @param {*} store
 */
export function tabouLoadIdentifyContent(action$, store) {
    return action$.ofType(LOAD_FEATURE_INFO)
        .filter(() => isTabou2Activate(store.getState()))
        .switchMap((action) => {
            if (action.layer && action.layer.id) {
                let resp = getTabouResponse(store.getState());
                // delete response for this GFI layer response
                delete resp[action.layer.name];

                // just keep response with features
                if (action?.data?.features && action.data.features.length) {
                    resp[action.layer.name] = action;
                }

                return Rx.Observable.of(setMainActiveTab("identify")).concat(
                    Rx.Observable.of(loadTabouFeatureInfo(resp)).concat(
                        Rx.Observable.of(closeIdentify())
                    )
                );
            }
            return Rx.Observable.empty();
        });
}

/**
 * Allow to change GetFeatureInfo format on plugin open and restore it on close
 * Change to application/json
 * @param {*} action$
 * @param {*} store
 */
export function tabouSetGFIFormat(action$, store) {
    return action$.ofType(TOGGLE_CONTROL)
        .filter(() => isTabou2Activate(store.getState()))
        .switchMap((action) => {
        if (action.control !== CONTROL_NAME) return Rx.Observable.empty();
        if (store.getState().controls[CONTROL_NAME].enabled) {
            // to save default info format from config or default MS2 config
            const defaultMime = generalInfoFormatSelector(store.getState());
            // change format to application/json
            return Rx.Observable.of(setDefaultInfoFormat(defaultMime))
                .concat(Rx.Observable.of(changeMapInfoFormat('application/json')))
                .concat(Rx.Observable.of(updateUserPlugin("Identify", { active: false })));
        }
        // restore default info format
        const firstDefaultMime = defaultInfoFormat(store.getState());
        return Rx.Observable.of(changeMapInfoFormat(firstDefaultMime))
            .concat(Rx.Observable.of(updateUserPlugin("Identify", { active: true })));

    });
}

/**
 * Purge info from Tabou identify panel.
 * @param {any} action$
 * @param {any} store
 */
export function purgeTabou(action$) {
    return action$.ofType(FEATURE_INFO_CLICK)
    .switchMap(() => {
        return Rx.Observable.of(loadTabouFeatureInfo({}));
    });
}
