import {Action, UserState} from ".."

const initState: UserState = {
    isLockScreen: true,
    isLogin: false,
    userInfo: undefined
}

type ActionType = any

export default function auth(state = initState, action: Action<ActionType>): UserState {
    switch (action.type) {
        // case ReduxType.ADD_PAYOUT:
        //     return {
        //         ...state,
        //         currentUser: {
        //             ...state.currentUser!!,
        //             waiterInfo: {
        //                 ...state.currentUser!!.waiterInfo,
        //                 payouts: [
        //                     ...state.currentUser!!.waiterInfo.payouts,
        //                     (action.payload as WaiterPayout)
        //                 ]
        //             }
        //         }
        //     }

        default:
            return state;
    }
}
