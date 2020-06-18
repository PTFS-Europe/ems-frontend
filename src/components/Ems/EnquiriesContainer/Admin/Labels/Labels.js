import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Label from './Label/Label';

import { fetchLabels } from '../../../../../store/labels/labelsActions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './Labels.module.scss';

const Labels = () => {
    const { t } = useTranslation();

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Make the state we need available
    const stateLabels = useSelector((state) => state.labels);

    // When we're mounted, fetch the labels
    useEffect(() => {
        // Only do this if we don't already have labels
        if (!stateLabels || stateLabels.labelList.length === 0) {
            dispatch(fetchLabels());
        }
        // Disable linting here, we do not want stateLabels.labelList.length
        // to be a dependency, this hook should only fire when we first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <aside className={styles.container}>
            <h1 className={styles.heading}>{t('Labels')}</h1>
            {stateLabels && stateLabels.loading && (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            )}
            {stateLabels && !stateLabels.loading && (
                <ul className={styles.labelList}>
                    {stateLabels &&
                        stateLabels.labelList
                            .sort(({ position: b }, { position: a }) => b - a)
                            .map((label) => (
                                <Label
                                    key={label.id}
                                    stateLabels={stateLabels}
                                    label={label}
                                />
                            ))}
                </ul>
            )}
        </aside>
    );
};

export default Labels;
