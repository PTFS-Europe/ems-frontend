import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './OptionPicker.module.scss';

const Option = ({ option, isSelected, onChoose }) => {
    const optionIsSelected = isSelected ? styles.selected : '';
    return (
        <button
            onClick={() => onChoose(option.id)}
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
    const callOnChoose = (args) => {
        onChoose(args);
        if (shouldClose) {
            setOpen(false);
        }
    };

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
            <button onClick={() => setOpen(true)} className={styles.button}>
                {selected.length === 0 && (
                    <div className={styles.promptText}>{promptText}</div>
                )}
                <div className={styles.buttonIcon}>
                    <FontAwesomeIcon alt={button.label} icon={button.icon} />
                </div>
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
    promptText: PropTypes.string.isRequired
};

export default OptionPicker;
