import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { LOGOUT_USER } from './activeUser/activeUserTypes';
import queriesReducer from './queries/queriesReducer';
import messagesReducer from './messages/messagesReducer';
import activeUserReducer from './activeUser/activeUserReducer';
import usersReducer from './users/usersReducer';
import foldersReducer from './folders/foldersReducer';
import labelsReducer from './labels/labelsReducer';

const appReducer = combineReducers({
    queries: queriesReducer,
    messages: messagesReducer,
    activeUser: activeUserReducer,
    users: usersReducer,
    folders: foldersReducer,
    labels: labelsReducer
});

// Our root reducer catches the USER_LOGOUT action and
// resets the state. See this helpful answer from
// Dan Abramov https://stackoverflow.com/a/35641992/424150
const rootReducer = (state, action) => {
    if (action.type === LOGOUT_USER) {
        state = undefined;
    }
    return appReducer(state, action);
};

const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
