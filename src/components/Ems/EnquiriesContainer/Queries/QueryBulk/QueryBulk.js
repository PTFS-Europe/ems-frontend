import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import {
    setQuerySelectedAll,
    updateQueryBulk
} from '../../../../../store/queries/queriesActions';
import useFilters from '../../../../../hooks/useFilters';
import BulkLabelPicker from '../../Admin/Labels/BulkLabelPicker/BulkLabelPicker';

import styles from './QueryBulk.module.scss';

const QueryBulk = () => {
    const [selectAll, setSelectAll] = useState(false);

    const { t } = useTranslation();
    const { isActiveFilter } = useFilters();

    const stateQueries = useSelector((state) => state.queries);
    const dispatch = useDispatch();

    // When the array of selected queries changes, determine if all
    // are selected and set selectAll accordingly
    useEffect(() => {
        setSelectAll(
            stateQueries.queryList.length === stateQueries.selected.length
        );
    }, [stateQueries.selected, stateQueries.queryList.length]);

    const moveSelectedToFolder = (folderCode) => {
        // Update any queries in our query list that need it
        const updatedQueries = stateQueries.queryList
            // Only alter queries that are selected
            .filter((toFilter) => stateQueries.selected.includes(toFilter.id))
            .map((query) => ({ ...query, folder: folderCode }));
        dispatch(updateQueryBulk(updatedQueries));
    };

    return (
        <>
            <div className={styles.checkboxContainer}>
                {!isActiveFilter && (
                    <>
                        <label htmlFor="filterCheckbox" className="hiddenLabel">
                            {t('You must filter queries before selecting all')}
                        </label>
                        <input
                            id="filterCheckbox"
                            title={t(
                                'You must filter queries before selecting all'
                            )}
                            type="checkbox"
                            checked={selectAll && stateQueries.queryList.length > 0}
                            onChange={() =>
                                dispatch(setQuerySelectedAll(!selectAll))
                            }
                            disabled={true}
                            className={styles.checkbox}
                        />
                    </>
                )}
                {isActiveFilter && (
                    <>
                        <label htmlFor="filterCheckbox" className="hiddenLabel">
                            {t('Checkbox')}
                        </label>
                        <input
                            id="filterCheckbox"
                            type="checkbox"
                            checked={selectAll && stateQueries.queryList.length > 0}
                            onChange={() =>
                                dispatch(setQuerySelectedAll(!selectAll))
                            }
                            disabled={false}
                            className={styles.checkbox}
                        />
                    </>
                )}
            </div>
            <div className={styles.divider} />
            <div className={styles.bulkActions}>
                <button
                    aria-label={t('Move to bin')}
                    disabled={stateQueries.selected.length === 0}
                    onClick={() => moveSelectedToFolder('BIN')}
                    type="button"
                    className={`${styles.button}`}
                >
                    <FontAwesomeIcon alt={t('Move to bin')} icon="trash-alt" />
                </button>
                <BulkLabelPicker
                    disabled={stateQueries.selected.length === 0}
                />
            </div>
        </>
    );
};

export default QueryBulk;
