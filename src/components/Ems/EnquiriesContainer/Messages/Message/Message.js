import React from 'react';

import styles from './Message.module.css';

const Message = ({ message }) => {
    return <div className={styles.message}>{JSON.stringify(message)}</div>;
};

export default Message;
