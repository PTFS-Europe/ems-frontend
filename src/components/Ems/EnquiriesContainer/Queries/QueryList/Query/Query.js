import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Truncate from 'react-truncate';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useActiveUser from '../../../../../../hooks/useActiveUser';
import { setQuerySelected } from '../../../../../../store/queries/queriesActions';
import UserIcon from '../../../../../UI/UserIcon/UserIcon';
import QueryActionButton from '../../../../../UI/QueryActionButton/QueryActionButton';
import QueryLabels from '../../../../../UI/QueryLabels/QueryLabels';

import styles from './Query.module.scss';

const Query = ({ query }) => {
    const [selected, setSelected] = useState(false);
    const [activeUser] = useActiveUser();

    const { t } = useTranslation();

    const stateQueries = useSelector((state) => state.queries);
    const stateSelected = stateQueries.selected;
    const stateUnseen = useSelector((state) => state.unseen);
    const dispatch = useDispatch();

    useEffect(() => setSelected(stateSelected.includes(query.id)), [
        query.id,
        stateSelected
    ]);

    const isActive =
        stateQueries.activeQuery &&
        (parseInt(query.id) === parseInt(stateQueries.activeQuery.id)) ?
            styles.active :
            '';
    const isPending = query.pending ? styles.semiTrans : '';
    const isDeleted = query.folder === 'COMPLETE' ? styles.semiTrans : '';
    const updatedAt = () => {
        return Object.prototype.hasOwnProperty.call(query, 'latestMessage')
            ? query.latestMessage.updated_at
            : query.updated_at;
    };
    const dispatchSelect = (e) => {
        e.stopPropagation();
        // Delay the dispatch until the next tick, there appears to be a bug in
        // React that causes the checkbox to not re-render otherwise:
        // https://old.reddit.com/r/reactjs/comments/8unyps/am_i_doing_stupid_or_is_this_a_bug_checkbox_not/
        setTimeout(() => dispatch(setQuerySelected(query.id)));
    };

    return (
        <div className={`${styles.query} ${isPending} ${isDeleted} ${isActive}`}>
            {activeUser.role_code === 'STAFF' && (
                <>
                    <label htmlFor={`selectCheckbox_${query.id}`} className="hiddenLabel">
                        {t('Checkbox')}
                    </label>
                    <input
                        id={`selectCheckbox_${query.id}`}
                        type="checkbox"
                        checked={selected}
                        onChange={dispatchSelect}
                        className={styles.checkbox}
                    />
                </>
            )}
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
                {activeUser.role_code === 'STAFF' && (
                    <div className={styles.queryLabels}>
                        <QueryLabels query={query} />
                    </div>
                )}
            </div>
            <div className={styles.metaActions}>
                <div role="complementary" className={styles.timestamp}>
                    {moment(updatedAt()).fromNow()}
                </div>
                <div className={styles.actionButtonPlaceholder}></div>
                {(activeUser.role_code === 'STAFF' ||
                    stateUnseen.unseenCounts[query.id] > 0) && (
                    <QueryActionButton query={query} />
                )}
            </div>
        </div>
    );
};

Query.propTypes = {
    query: PropTypes.object.isRequired
};

export default Query;
