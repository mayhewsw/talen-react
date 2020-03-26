import { dataConstants } from '../_constants';
import { dataService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const dataActions = {
    getDatasets
};

function getDatasets() {
    return dispatch => {
        
        dataService.getDatasets()
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(data) { return { type: dataConstants.GETALL_SUCCESS, data }}
}
