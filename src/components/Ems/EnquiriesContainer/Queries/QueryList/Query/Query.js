import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserIcon from '../../../../../UI/UserIcon/UserIcon';

import styles from './Query.module.css';

function Query({ query }) {
    return (
        <li className={styles.query}>
            <div className={styles.user}>
                <UserIcon />
            </div>
            <div className={styles.querySummary}>
                <h1 className={styles.queryTitle}>{query.title}</h1>
                <div className={styles.headMessage}>
                    First line of the most recent message
                </div>
            </div>
            <div className={styles.metaActions}>
                <div role="complementary" className={styles.timestamp}>
                    {moment(query.updated_at).fromNow()}
                </div>
                <button className={styles.queryActions}>
                    <FontAwesomeIcon icon="ellipsis-h" />
                </button>
            </div>
        </li>
    );
}

Query.propTypes = {
    query: PropTypes.object.isRequired
};

export default Query;
