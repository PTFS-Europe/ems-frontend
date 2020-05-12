import React from 'react';
import PropTypes from 'prop-types';

import styles from './Message.module.scss';

const Message = ({ message }) => {
    return <li className={styles.message}>{message.content}</li>;
};

Message.propTypes = {
    message: PropTypes.object.isRequired
};

export default Message;
