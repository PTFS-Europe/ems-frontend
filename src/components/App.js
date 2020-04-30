import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import Ems from './Ems/Ems';

library.add(faEllipsisH);

function App() {
    return <Ems></Ems>;
}

export default App;
