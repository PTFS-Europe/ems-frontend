import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import { setQuerySearch } from '../../../../../store/queries/queriesActions';
import styles from './QuerySearch.module.scss';

const QuerySearch = () => {
    const { t } = useTranslation();

    const history = useHistory();

    const dispatch = useDispatch();
    const search = useSelector((state) => state.queries.search);

    // Initiate query creation
    const startNewQuery = () => {
        history.push('/');
    };

    return (
        <div role="search" className={styles.querySearch}>
            <div className={styles.searchContainer}>
                <div
                    data-testid="query-search-icon"
                    className={styles.searchIcon}
                >
                    <FontAwesomeIcon alt={t('Search icon')} icon="search" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        dispatch(setQuerySearch({ search: e.target.value }))
                    }
                    className={styles.querySearchInput}
                    placeholder={t('Search or start new query')}
                ></input>
                <button
                    onClick={startNewQuery}
                    type="button"
                    className={styles.newQueryButton}
                >
                    <FontAwesomeIcon
                        alt={t('Start a new query')}
                        icon="plus-circle"
                    />
                </button>
            </div>
        </div>
    );
};

export default QuerySearch;
