import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Popover from 'react-tiny-popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    createLabel,
    updateLabel,
    deleteLabel
} from '../../../../../../store/labels/labelsActions';
import ColourPicker from '../../../../../UI/ColourPicker/ColourPicker';
import ConfirmAction from '../../../../../UI/ConfirmAction/ConfirmAction';
import styles from './LabelEdit.module.scss';

const LabelEdit = ({
    label = { name: '', id: 99999, colour: '#ccc' },
    activeColourPicker,
    setActiveColourPicker,
    hasHover,
    setHasHover,
    setAddingNew
}) => {
    const [localLabel, setLocalLabel] = useState(label);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Enable us to dispatch
    const dispatch = useDispatch();

    const { t } = useTranslation();

    // When the label we're passed changes, update our local state
    useEffect(() => {
        setLocalLabel(label);
        setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label.name]);

    useEffect(() => {
        if (
            localLabel.name !== label.name ||
            localLabel.colour !== label.colour
        ) {
            setDirty(true);
        } else {
            setDirty(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localLabel, label]);

    const labelIcon = (colour) => (
        <FontAwesomeIcon
            alt={t('Label icon')}
            style={{ color: colour }}
            icon={'tag'}
        />
    );

    // Dispatch the action to update a label
    const dispatchUpdate = () => {
        // Only proceed if the name is populated
        if (localLabel.name.length === 0) {
            return;
        }
        // If we're using the temporary ID, remove it before
        // making the API call
        if (localLabel.id === 99999) {
            delete localLabel.id;
        }
        // Remove the colour picker popover
        // We set -1 since using null causes it to fail
        // PropTypes.isRequired
        setActiveColourPicker(-1);
        const action = localLabel.id ? updateLabel : createLabel;
        // Dispatch the action, optionally resetting the display of the
        // "Add a new label" button in our parent, once the creation is complete
        dispatch(action({ id: localLabel.id, ...localLabel })).then(
            () => {
                if (action === createLabel) {
                    setAddingNew(false);
                }
            }
        );
    };

    // Dispatch the action to delete a label
    const dispatchDelete = () => {
        dispatch(deleteLabel(label));
    };

    const updateColour = ({ colour }) => {
        setLocalLabel({ ...localLabel, colour });
        setActiveColourPicker(-1);
    };

    // Is an action pending on this label
    const isPending = label.pending ? styles.pending : '';

    const hideDelete = hasHover !== label.id ? styles.hideDelete : '';

    return (
        <li
            key={label.id}
            className={`${styles.label} ${isPending}`}
            onMouseOver={() => setHasHover(label.id)}
            onMouseLeave={() => setHasHover(0)}
        >
            <Popover
                role="dialog"
                isOpen={activeColourPicker === localLabel.id}
                position={'right'}
                onClickOutside={() => setActiveColourPicker(-1)}
                content={
                    <ColourPicker
                        updateColour={updateColour}
                        icon={labelIcon}
                    />
                }
            >
                <button
                    aria-label={label.name}
                    onClick={() =>
                        setActiveColourPicker(
                            // We reset to -1 since using null causes it to fail
                            // PropTypes.isRequired
                            activeColourPicker === localLabel.id ? -1 : label.id
                        )
                    }
                    type="button"
                    className={styles.labelIcon}
                    style={{ color: localLabel.colour }}
                    data-testid="labelIcon"
                >
                    <FontAwesomeIcon alt={label.name} icon={'tag'} />
                </button>
            </Popover>
            <div className={styles.inputContainer}>
                <label
                    htmlFor={`labelEntry_${label.id || 'new'}`}
                    className="hiddenLabel">
                    {t('Label name')}
                </label>
                <input
                    id={`labelEntry_${label.id || 'new'}`}
                    placeholder={t('Label name')}
                    value={localLabel.name}
                    onChange={(e) => setLocalLabel({ ...localLabel, name: e.target.value })}
                    type="text"
                    className={styles.labelName}
                />
                {dirty && (
                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={dispatchUpdate}
                    >
                        <FontAwesomeIcon alt={t('Save')} icon={'check-square'} />
                    </button>
                )}
            </div>
            <ConfirmAction
                setOpen={setConfirmOpen}
                open={confirmOpen}
                onConfirm={dispatchDelete}
                onCancel={() => setConfirmOpen(false)}
            >
                <button
                    aria-label={label.name}
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    className={`${styles.deleteButton} ${hideDelete}`}
                >
                    <FontAwesomeIcon alt={label.name} icon={'times'} />
                </button>
            </ConfirmAction>
        </li>
    );
};

LabelEdit.propTypes = {
    label: PropTypes.object,
    activeColourPicker: PropTypes.number.isRequired,
    setActiveColourPicker: PropTypes.func.isRequired,
    hasHover: PropTypes.number.isRequired,
    setHasHover: PropTypes.func.isRequired,
    setAddingNew: PropTypes.func
};

export default LabelEdit;
