import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Popover from 'react-tiny-popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { debounce } from '../../../../../../util/ui';
import {
    createLabel,
    updateLabel,
    deleteLabel
} from '../../../../../../store/labels/labelsActions';
import ColourPicker from '../../../../../UI/ColourPicker/ColourPicker';
import ConfirmAction from '../../../../../UI/ConfirmAction/ConfirmAction';
import styles from './LabelEdit.module.scss';

const LabelEdit = ({
    label = { name: '' },
    activeColourPicker,
    setActiveColourPicker
}) => {
    const [labelName, setLabelName] = useState(label.name);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Make the state we need available
    const stateLabelsCounts = useSelector((state) => state.labels.labelsCounts);

    // We create a ref containing a debounced dispatch. Just creating a
    // debounced dispatch, without storing it in a ref seemed to break the
    // debouncing, I think because the function that was returned was
    // different every time it was called (I'm not 100% sure why that would
    // be). So the debouncer didn't recognise it as multiple calls to the
    // same function
    const debouncedDispatchRef = useRef();

    const { t } = useTranslation();

    // Create the debounced dispatch and debounced setLabelName
    // and store them in the ref
    useEffect(() => {
        if (!debouncedDispatchRef.current) {
            debouncedDispatchRef.current = {
                dispatch: debounce(dispatch, 1000),
                setLabelName: debounce(setLabelName, 1000)
            };
        }
    }, [dispatch]);

    // When our internal labelName state changes, we may need to send
    // a debounced update to the server. We're using a ref to avoid doing
    // an update when we first mount
    const myRef = useRef(false);
    useEffect(() => {
        // If this isn't the first time labelName has changed, i.e.
        // we've not just mounted
        if (myRef.current && labelName.length > 0) {
            dispatchUpdate({ name: labelName }, true);
        }
        // Ensure any future changes of labelName cause a dispatch
        myRef.current = true;
        // Disable liniting on the dependencies, why would dispatchUpdate
        // make sense as a dependency here...
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labelName]);

    const getColour = (colour) => (colour ? colour : '#ccc');

    const labelIcon = (colour) => (
        <FontAwesomeIcon
            alt={t('Label icon')}
            style={{ color: colour }}
            icon={'tag'}
        />
    );

    // Dispatch the action to update a label
    const dispatchUpdate = (props, debounced) => {
        // Remove the colour picker popover
        // We set -1 since using null causes it to fail
        // PropTypes.isRequired
        setActiveColourPicker(-1);
        const action = label.id ? updateLabel : createLabel;
        if (debounced) {
            debouncedDispatchRef.current.dispatch(
                action({ id: label.id, ...props })
            );
            if (!label.id) {
                debouncedDispatchRef.current.setLabelName('');
            }
        } else {
            dispatch(action({ id: label.id, ...props }));
        }
    };

    // Dispatch the action to delete a label
    const dispatchDelete = () => {
        dispatch(deleteLabel(label));
    };

    // Is an action pending on this label
    const isPending = label.pending ? styles.pending : '';

    // Should a label be deleteable
    const canDelete = !label.id ? styles.noDelete : '';

    return (
        <li key={label.id} className={`${styles.label} ${isPending}`}>
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
                    className={`${styles.deleteButton} ${canDelete}`}
                >
                    <FontAwesomeIcon alt={label.name} icon={'times'} />
                </button>
            </ConfirmAction>
            <Popover
                role="dialog"
                isOpen={activeColourPicker === label.id}
                position={'right'}
                onClickOutside={() => setActiveColourPicker(-1)}
                content={
                    <ColourPicker
                        updateColour={dispatchUpdate}
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
                            activeColourPicker === label.id ? -1 : label.id
                        )
                    }
                    type="button"
                    className={styles.labelIcon}
                    style={{ color: getColour(label.colour) }}
                    data-testid="labelIcon"
                >
                    <FontAwesomeIcon alt={label.name} icon={'tag'} />
                </button>
            </Popover>
            <label
                htmlFor={`labelEntry_${label.id || 'new'}`}
                className="hiddenLabel">
                {t('New label')}
            </label>
            <input
                id={`labelEntry_${label.id || 'new'}`}
                placeholder={t('New label')}
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                type="text"
                className={styles.labelName}
            />
            <span className={styles.labelCount}>
                {stateLabelsCounts[label.id] || 0}
            </span>
        </li>
    );
};

LabelEdit.propTypes = {
    label: PropTypes.object,
    activeColourPicker: PropTypes.number.isRequired,
    setActiveColourPicker: PropTypes.func.isRequired
};

export default LabelEdit;
