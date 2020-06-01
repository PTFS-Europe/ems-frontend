import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faEllipsisH,
    faSearch,
    faPaperclip,
    faPaperPlane,
    faTrashAlt,
    faPencilAlt,
    faCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

import Ems from './Ems/Ems';

library.add(
    faEllipsisH,
    faSearch,
    faPaperclip,
    faPaperPlane,
    faTrashAlt,
    faPencilAlt,
    faCheck,
    faTimes
);

const App = () => {
    return <Ems></Ems>;
};

export default App;
