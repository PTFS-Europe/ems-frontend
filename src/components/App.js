import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faEllipsisH,
    faSearch,
    faPaperclip,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

import Ems from './Ems/Ems';

library.add(faEllipsisH, faSearch, faPaperclip, faPaperPlane);

const App = () => {
    return <Ems></Ems>;
};

export default App;
