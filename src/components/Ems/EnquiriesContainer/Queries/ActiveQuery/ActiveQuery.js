import React from 'react';

import QueryHeader from '../QueryHeader/QueryHeader';
import NewQuery from '../NewQuery/NewQuery';
import Welcome from '../../../../UI/Welcome/Welcome';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';
import useActiveUser from '../../../../../hooks/useActiveUser';
import useActiveQuery from '../../../../../hooks/useActiveQuery';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = () => {
    const [activeUser] = useActiveUser();
    const [queryId] = useActiveQuery();

    // Front page content
    const getFrontPage = () => {
        // Don't display anything until we're ready
        if (!activeUser.role_code) {
            return null;
        }
        if (activeUser.role_code === 'STAFF') {
            return <Welcome />;
        } else {
            return <NewQuery />;
        }
    };

    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            {!queryId && getFrontPage()}
            {queryId && <MessageList />}
            {queryId && <QueryEntry className={styles.queryEntry} />}
        </main>
    );
};

export default ActiveQuery;
