import React from 'react';

import styles from './Message.module.css';

const Message = ({ message }) => {
    return <li className={styles.message}>{message.content}</li>;
};

export default Message;
