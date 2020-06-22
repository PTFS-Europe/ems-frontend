import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Truncate from 'react-truncate';

import UserIcon from '../../../../../UI/UserIcon/UserIcon';

import styles from './Query.module.scss';

const Query = ({ query }) => {
    const isPending = query.pending ? styles.pending : '';
    const updatedAt = () => {
        return query.hasOwnProperty('latestMessage')
            ? query.latestMessage.updated_at
            : query.updated_at;
    };
    return (
        <li className={`${styles.query} ${isPending}`}>
            {query.latestMessage && (
                <UserIcon userId={query.latestMessage.creator_id} />
            )}
            {!query.latestMessage && <UserIcon userId={query.initiator} />}
            <div className={styles.querySummary}>
                <h1 className={styles.queryTitle}>{query.title}</h1>
                {query.latestMessage && (
                    <div className={styles.headMessage}>
                        <Truncate lines={3}>
                            {query.latestMessage.content}
                        </Truncate>
                    </div>
                )}
            </div>
            <div className={styles.metaActions}>
                <div role="complementary" className={styles.timestamp}>
                    {moment(updatedAt()).fromNow()}
                </div>
                <button className={styles.queryActions}>
                    <FontAwesomeIcon icon="ellipsis-h" />
                </button>
            </div>
        </li>
    );
};

Query.propTypes = {
    query: PropTypes.object.isRequired
};

export default Query;
