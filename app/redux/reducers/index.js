import { combineReducers } from 'redux';
import auth from './auth';
import tabState from './tabReducer'
import error from './errorMessage'
import form from './form'

const rootReducer = combineReducers({
    tabState,
    auth,
    error,
    form
});

export default rootReducer;
