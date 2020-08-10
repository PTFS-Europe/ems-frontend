import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

export function renderWithRouterMatch(
    ui,
    {
        path = '/',
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] })
    } = {}
) {
    return {
        ...render(
            <Router history={history}>
                <Route path={path} component={ui} />
            </Router>
        )
    };
}

// A component that can use whatever custom hook we pass it,
// this will enable us to test the hook:
// https://kentcdodds.com/blog/how-to-test-custom-react-hooks
// and
// https://medium.com/@nitinpatel_20236/unit-testing-custom-react-hooks-caa86f58510
const TestHook = ({ callback }) => {
    callback();
    return null;
};
export const testHook = (callback) => {
    return {
        ...render(<TestHook callback={callback} />)
    };
};
