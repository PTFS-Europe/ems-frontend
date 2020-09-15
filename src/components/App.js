import React from 'react';

import addIcons from '../util/fontawesome';
import Ems from './Ems/Ems';
import useMountable from '../hooks/useMountable';

const App = () => {
    // We may block the mounting of the app until we have tried to
    // obtain a token. We render regardless or whether we got one
    // or not
    const [complete, hasAuth] = useMountable();

    // Add the Font Awesome icons we need
    addIcons();

    return complete ? <Ems hasAuth={hasAuth}></Ems> : null;
};

export default App;
