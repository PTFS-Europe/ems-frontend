import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import queriesReducer from './queries/queriesReducer';
import messagesReducer from './messages/messagesReducer';
import activeUserReducer from './activeUser/activeUserReducer';
import usersReducer from './users/usersReducer';

const rootReducer = combineReducers({
    queries: queriesReducer,
    messages: messagesReducer,
    activeUser: activeUserReducer,
    users: usersReducer
});

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
