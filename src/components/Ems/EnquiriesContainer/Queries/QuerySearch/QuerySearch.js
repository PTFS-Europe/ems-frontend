import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './QuerySearch.module.css';

const QuerySearch = () => {
    const { t } = useTranslation();
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
                    aria-placeholder={t('Search or start new query')}
                    className={styles.querySearchInput}
                    placeholder={t('Search or start new query')}
                ></input>
            </div>
        </div>
    );
};

export default QuerySearch;
