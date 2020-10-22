import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import {
    setQuerySearch,
    updateActiveQuery
} from '../../../../../store/queries/queriesActions';
import styles from './QuerySearch.module.scss';

const QuerySearch = ({ placeholder, showAdd }) => {
    const { t } = useTranslation();

    const history = useHistory();

    const dispatch = useDispatch();
    const search = useSelector((state) => state.queries.search);

    // Initiate query creation
    const startNewQuery = () => {
        dispatch(setQuerySearch(''));
        dispatch(updateActiveQuery());
        history.push('/');
    };

    return (
        <div role="search" className={styles.searchContainer}>
            <div data-testid="query-search-icon" className={styles.searchIcon}>
                <FontAwesomeIcon alt={t('Search icon')} icon="search" />
            </div>
            <label htmlFor="searchInput" className="hiddenLabel">
                {placeholder}
            </label>
            <input
                id="searchInput"
                type="text"
                value={search}
                onChange={(e) =>
                    dispatch(setQuerySearch({ search: e.target.value }))
                }
                className={styles.querySearchInput}
                placeholder={placeholder}
            ></input>
            {showAdd && (
                <button
                    aria-label={t('Start a new query')}
                    onClick={startNewQuery}
                    type="button"
                    className={styles.newQueryButton}
                >
                    <FontAwesomeIcon
                        alt={t('Start a new query')}
                        icon="plus-circle"
                    />
                </button>
            )}
        </div>
    );
};

QuerySearch.propTypes = {
    placeholder: PropTypes.string.isRequired,
    showAdd: PropTypes.bool.isRequired
};

export default QuerySearch;
