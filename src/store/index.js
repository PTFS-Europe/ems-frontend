import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import queriesReducer from './queries/queriesReducer';
import messagesReducer from './messages/messagesReducer';
import activeUserReducer from './activeUser/activeUserReducer';
import usersReducer from './users/usersReducer';
import foldersReducer from './folders/foldersReducer';
import labelsReducer from './labels/labelsReducer';

const rootReducer = combineReducers({
    queries: queriesReducer,
    messages: messagesReducer,
    activeUser: activeUserReducer,
    users: usersReducer,
    folders: foldersReducer,
    labels: labelsReducer
});

const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
