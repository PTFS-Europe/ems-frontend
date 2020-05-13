import React from 'react';
import PropTypes from 'prop-types';

import styles from './Message.module.scss';

const Message = ({ message, css }) => {
    const finalStyles = `${styles.message} ${styles[css]}`;
    return <li className={finalStyles}>{message.content}</li>;
};

Message.propTypes = {
    css: PropTypes.string,
    message: PropTypes.object.isRequired
};

export default Message;
