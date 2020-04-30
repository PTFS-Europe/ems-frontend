import React from 'react';

import Message from './Message/Message';

import styles from './Messages.module.css';

const data = [
    {
        id: 3,
        query_id: 20,
        creator_id: 2,
        content: 'Hi - how can I help?',
        created_at: '2020-04-16 15:54:00.402287+01',
        updated_at: '2020-04-16 15:54:00.402287+01',
        filename: null
    }
];

const Messages = () => {
    return (
        <div className={styles.messages}>
            {data &&
                data.map((message) => (
                    <Message key={message.id} message={message}></Message>
                ))}
        </div>
    );
};

export default Messages;
