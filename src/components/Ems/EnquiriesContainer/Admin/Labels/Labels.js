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
    const [addingNew, setAddingNew] = useState(false);
    const [hasHover, setHasHover] = useState(0);
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
                    className={`${styles.editButton} ${editing ? styles.editing : ''}`}
                    type="button"
                >
                    {!editing && (
                        <>
                            <FontAwesomeIcon
                                alt={t('Edit labels')}
                                icon="pen"
                            />
                            <div className={styles.editButtonTextEdit}>{t('Edit')}</div>
                        </>
                    )}
                    {editing && (
                        <>
                            <FontAwesomeIcon
                                alt={t('Finish editing')}
                                icon="check"
                            />
                            <span className={styles.editButtonTextDone}>{t('Done')}</span>
                        </>
                    )}
                </button>
            </div>
            {labelList.length === 0 && (
                <div className={styles.noLabels}>{t('No labels defined')}</div>
            )}
            <div className={styles.listContainer}>
                <ul className={styles.labelList}>
                    {editing && !addingNew && (
                        <li
                            className={styles.addNewLabel}
                            onClick={() => setAddingNew(true)}
                        >
                            <FontAwesomeIcon
                                alt={t('Add a new label')}
                                icon="plus-circle"
                            />
                            <span className={styles.addNewLabelText}>
                                {t('Add a new label')}
                            </span>
                        </li>
                    )}
                    {editing && addingNew && (
                        <LabelEdit
                            hasHover={0}
                            setHasHover={() => setHasHover(0)}
                            activeColourPicker={activeColourPicker}
                            setActiveColourPicker={
                                setActiveColourPicker
                            }
                            setAddingNew={setAddingNew}
                        />
                    )}
                    {labelList &&
                        labelList.length > 0 &&
                        labelList.map((label) => {
                            return editing ? (
                                <LabelEdit
                                    hasHover={hasHover}
                                    setHasHover={setHasHover}
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
                </ul>
            </div>
        </aside>
    );
};

export default Labels;
