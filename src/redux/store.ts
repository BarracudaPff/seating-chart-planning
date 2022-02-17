import {combineReducers, createStore} from "redux";
// import {AppState} from "../models";
// import {ReduxType} from "../models/types";
import {composeWithDevTools} from "redux-devtools-extension";
import {ReduxType} from "../models/types";
import {AppState} from ".";
import {applyMiddleware} from "redux";
import {createLogger} from "redux-logger";
import user from "./reducers/user";
// import {rdc_auth, rdc_navigation} from "./reducers";


/**
 * navigation must always be last reducer
 */
const rootReducer = combineReducers<AppState>({
    // auth: rdc_auth,
    user: user
    // navigation: rdc_navigation,
    // chat: rdc_chat,
    // parties: rdc_parties,
    // stories: rdc_stories,
    // settings: rdc_internal
})

const actionTypeEnumToString = (action: any): any => typeof action.type === "number" && ReduxType[action.type]
    ? ({...action, type: ReduxType[action.type]})
    : action;

const LOG = false

const logger = createLogger({actionTransformer: actionTypeEnumToString, logger: console, colors: false});
const composeEnhancers = composeWithDevTools({actionSanitizer: actionTypeEnumToString});
const store = createStore(rootReducer, LOG ? composeEnhancers(applyMiddleware(logger)) : composeEnhancers())

export default store
