import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Truncate from 'react-truncate';

import UserIcon from '../../../../../UI/UserIcon/UserIcon';
import QueryActionButton from '../../../../../UI/QueryActionButton/QueryActionButton';
import QueryLabels from '../../../../../UI/QueryLabels/QueryLabels';

import styles from './Query.module.scss';

const Query = ({ query }) => {
    const isPending = query.pending ? styles.semiTrans : '';
    const isDeleted = query.folder === 'COMPLETE' ? styles.semiTrans : '';
    const updatedAt = () => {
        return query.hasOwnProperty('latestMessage')
            ? query.latestMessage.updated_at
            : query.updated_at;
    };
    return (
        <li className={`${styles.query} ${isPending} ${isDeleted}`}>
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
                <div className={styles.queryLabels}>
                    <QueryLabels labels={query.labels} />
                </div>
            </div>
            <div className={styles.metaActions}>
                <div role="complementary" className={styles.timestamp}>
                    {moment(updatedAt()).fromNow()}
                </div>
                <div className={styles.actionButtonPlaceholder}></div>
                <QueryActionButton query={query} />
            </div>
        </li>
    );
};

Query.propTypes = {
    query: PropTypes.object.isRequired
};

export default Query;
