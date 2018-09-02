import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import rootReducer from './reducers';
import LocalStorage from '../LocalStorage';

var persistData = store => next => (action) => {
  let result = next(action)

  switch (action.type) {
    case 'SIGNUP_SUCCEED':
    case 'LOGIN_SUCCEED':
        LocalStorage.setItem('username', action.username);
        LocalStorage.setItem('lastLoginType', action.lastLoginType);
        break;
    case 'LOGOUT':
        LocalStorage.removeItem('username');
        LocalStorage.removeItem('lastLoginType');
        break;
    default:
      break;
  }

  return result;
}

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware, persistData)(createStore);
const store = createStoreWithMiddleware(rootReducer);

export default store;
