import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Label from './Label/Label';
import LabelEdit from './LabelEdit/LabelEdit';

import { fetchLabels } from '../../../../../store/labels/labelsActions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './Labels.module.scss';

const Labels = () => {
    const [editing, setEditing] = useState(false);
    // This state is not used directly by this component, it is passed
    // down to the LabelEdit component, so we can ensure that only a single
    // colour edit popover is open at a time. It contains the ID of the
    // LabelEdit component that has the popover open
    //
    // We use -1 as the default since using null causes it to fail
    // PropTypes.isRequired
    const [activeColourPicker, setActiveColourPicker] = useState(-1);

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

    const toggleEditing = () => {
        setEditing(!editing);
    };

    // The list of labels we iterate through should only be sorted if we're
    // not editing. We receive the labels sorted from the API, so this is just
    // to prevent newly created labels from immediately moving to their correct
    // position
    const labelList = editing
        ? stateLabels.labelList
        : stateLabels.labelList.sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );

    if (!stateLabels || (stateLabels && stateLabels.loading)) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <aside className={styles.container}>
            <div className={styles.headingContainer}>
                <h1 className={styles.heading}>{t('Labels')}</h1>
                <button
                    aria-label={editing ? t('Finish editing') : t('Edit labels')}
                    onClick={toggleEditing}
                    className={styles.editButton}
                    type="button"
                >
                    {!editing && (
                        <FontAwesomeIcon
                            alt={t('Edit labels')}
                            icon="pen-square"
                        />
                    )}
                    {editing && (
                        <FontAwesomeIcon
                            alt={t('Finish editing')}
                            icon="check-square"
                        />
                    )}
                </button>
            </div>
            {labelList.length === 0 && (
                <div className={styles.noLabels}>{t('No labels defined')}</div>
            )}
            <div className={styles.listContainer}>
                <ul className={styles.labelList}>
                    {labelList &&
                        labelList.length > 0 &&
                        labelList.map((label) => {
                            return editing ? (
                                <LabelEdit
                                    activeColourPicker={activeColourPicker}
                                    setActiveColourPicker={
                                        setActiveColourPicker
                                    }
                                    key={label.id}
                                    label={label}
                                />
                            ) : (
                                <Label
                                    key={label.id}
                                    stateLabels={stateLabels}
                                    label={label}
                                />
                            );
                        })}
                    {editing && (
                        <LabelEdit
                            activeColourPicker={activeColourPicker}
                            setActiveColourPicker={setActiveColourPicker}
                        />
                    )}
                </ul>
            </div>
        </aside>
    );
};

export default Labels;
