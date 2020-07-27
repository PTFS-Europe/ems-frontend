import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './OptionPicker.module.scss';

const Option = ({ option, isSelected, onChoose }) => {
    const optionIsSelected = isSelected ? styles.selected : '';
    return (
        <button
            onClick={(e) => onChoose(e, option.id)}
            className={`${styles.option} ${optionIsSelected}`}
        >
            <div
                data-testid="optionindicator"
                className={styles.indicator}
                style={{ background: option.colour }}
            ></div>
            {option.label}
        </button>
    );
};

const Options = ({ options, onChoose, selected }) => {
    return (
        <div role="dialog" className={styles.container}>
            {options.map((option) => (
                <Option
                    onChoose={onChoose}
                    key={option.id}
                    option={option}
                    isSelected={selected.includes(option.id)}
                />
            ))}
        </div>
    );
};

const OptionPicker = ({
    options,
    onChoose,
    button,
    selected,
    promptText,
    shouldClose = true
}) => {
    const [open, setOpen] = useState(false);

    // We might want to close when an option is selected, so do that
    // if appropriate
    const callOnChoose = (e, args) => {
        // Stop the click event from propogating further up, if we don't
        // it can trigger click events in elements of which we might be
        // descendants
        // We may be a descendant of a NavLink, if we don't preventDefault
        // we may cause the link to be clicked
        e.preventDefault();
        e.stopPropagation();
        onChoose(args);
        if (shouldClose) {
            setOpen(false);
        }
    };

    // Stop the click event from propogating further up, if we don't
    // it can trigger click events in elements of which we might be
    // descendants
    // We may be a descendant of a NavLink, if we don't preventDefault
    // we may cause the link to be clicked
    const handleOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!button.disabled) {
            setOpen(true);
        }
    };

    const buttonAdditionalStyles = button.disabled ? styles.disabled : '';

    return (
        <Popover
            isOpen={open}
            position={'right'}
            content={
                <Options
                    options={options}
                    selected={selected}
                    onChoose={callOnChoose}
                />
            }
            onClickOutside={() => setOpen(false)}
        >
            <button
                onClick={handleOpen}
                className={`${styles.button} ${buttonAdditionalStyles}`}
            >
                {selected.length === 0 && promptText && (
                    <div className={styles.promptText}>{promptText}</div>
                )}
                <FontAwesomeIcon alt={button.label} icon={button.icon} />
            </button>
        </Popover>
    );
};

Option.propTypes = {
    option: PropTypes.object.isRequired,
    onChoose: PropTypes.func.isRequired
};

Options.propTypes = {
    options: PropTypes.array.isRequired,
    onChoose: PropTypes.func.isRequired,
    selected: PropTypes.array.isRequired
};

OptionPicker.propTypes = {
    options: PropTypes.array.isRequired,
    onChoose: PropTypes.func.isRequired,
    button: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    shouldClose: PropTypes.bool,
    promptText: PropTypes.string
};

export default OptionPicker;
