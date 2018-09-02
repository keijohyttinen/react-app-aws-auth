

import {
  Api
} from '../../api/AWSRest'

var api = new Api();

import awsmobile from '../../api/aws-exports';
const cloudLogicArray = JSON.parse(awsmobile.aws_cloud_logic_custom);

const loadTicketsRequest = () => {
    return {
        type: 'LOAD_TICKETS_REQUEST'
    };
};
const loadTicketsFailed= (err) => {
    return {
        type: 'LOAD_TICKETS_FAILED',
        error: err
    };
};

const loadTicketsSucceed = (resp) => {
    return {
        type: 'LOAD_TICKETS_SUCCEED',
        tickets: resp
    };
};

export const loadTickets = () => async dispatch => {

    // Get endpoint
    const endPoint = cloudLogicArray[0].endpoint;
    const requestParams = {
      method: 'GET',
      url: endPoint + '/tickets',
    };

    dispatch(loadTicketsRequest());
    return api.restRequest(requestParams)
        .then((apiResponse) => {
            console.log("apiResp: " + JSON.stringify(apiResponse));
            dispatch(loadTicketsSucceed(apiResponse));
        })
        .catch((err) => {
            dispatch(loadTicketsFailed(err));
        });
}
