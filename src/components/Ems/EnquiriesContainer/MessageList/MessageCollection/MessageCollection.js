import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Message from '../Message/Message';
import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './MessageCollection.module.scss';

const MessageCollection = ({ collection, userList, activeUser }) => {
    const { t } = useTranslation();
    const getSenderText = () => {
        const user = userList.find((u) => u.id === collection.sender);
        if (!user) {
            return null;
        }
        return user.id === activeUser.id ? t('You') : user.name;
    };
    return (
        <div role="group" className={styles.collection}>
            <div className={styles.creatorAvatar}>
                <UserIcon />
            </div>
            <div className={styles.collectionContent}>
                <h1 className={styles.creator}>{getSenderText()}</h1>
                <ul className={styles.messages}>
                    {collection.messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            user={userList.find(
                                (user) => user.id === message.creator_id
                            )}
                            activeUser={activeUser.userDetails}
                        />
                    ))}
                </ul>
                <div
                    data-testid="message-timestamp"
                    className={styles.timestamp}
                >
                    {moment(collection.timestamp).fromNow()}
                </div>
            </div>
        </div>
    );
};

MessageCollection.propTypes = {
    collection: PropTypes.object.isRequired,
    userList: PropTypes.array.isRequired,
    activeUser: PropTypes.object.isRequired
};

export default MessageCollection;
