import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH, faSearch } from '@fortawesome/free-solid-svg-icons';

import Ems from './Ems/Ems';

library.add(faEllipsisH, faSearch);

const App = () => {
    return <Ems></Ems>;
};

export default App;
