import React from 'react';
import PropTypes from 'prop-types';

import styles from './Message.module.scss';

const Message = ({ message, css }) => {
    // The updated_at property is only returned from the API, so we
    // can use that to determine if the message we're displaying is
    // the placeholder that is awaiting an API response or not
    const getIsPending = () => {
        return !message.hasOwnProperty('updated_at');
    };
    // Compile the list of styles this message needs
    const stylesList = [styles.message, styles[css]];
    if (getIsPending()) {
        stylesList.push(styles.pending);
    }
    const finalStyles = stylesList.join(' ');
    return <li className={finalStyles}>{message.content}</li>;
};

Message.propTypes = {
    css: PropTypes.string,
    message: PropTypes.object.isRequired
};

export default Message;
