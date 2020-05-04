import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import queriesReducer from './queries/queriesReducer';
import messagesReducer from './messages/messagesReducer';

const rootReducer = combineReducers({
    queries: queriesReducer,
    messages: messagesReducer
});

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
