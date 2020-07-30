import { MessageTypes, ALERT_SUCCESS, ALERT_CLEAR, ALERT_ERROR } from '../_utils/types'

export const alertActions = {
    success,
    error,
    clear
};

function success(message: string): MessageTypes {
    return { type: ALERT_SUCCESS, message };
}

function error(message: string): MessageTypes {
    return { type: ALERT_ERROR, message };
}

function clear(): MessageTypes {
    return { type: ALERT_CLEAR };
}