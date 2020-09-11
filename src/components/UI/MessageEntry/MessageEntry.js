import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';

import {
    setActiveMessageId,
    setActiveMessageText
} from '../../../store/activeMessage/activeMessageActions';

import styles from './MessageEntry.module.scss';

const MessageEntry = ({
    dispatchSendAction,
    dispatchEditAction,
    dispatchUpload,
    cssOverrides = {},
    maxRows = 10,
    minRows = 1
}) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const stateMessages = useSelector((state) => state.messages);
    const stateActiveMessage = useSelector((state) => state.activeMessage);

    const getStyle = () => stateActiveMessage.id ? styles.edit : '';

    // Reset the entry box
    const resetEntry = () => {
        dispatch(setActiveMessageText(''))
        dispatch(setActiveMessageId(null));
    };

    // Catch the enter key being pressed
    const keyIsPressed = (e) => {
        if (e.key === 'Enter') {
            // Prevent the newline from being added
            e.preventDefault();
            if (stateActiveMessage.id) {
                dispatchEditAction(resetEntry);
            } else {
                dispatchSendAction(resetEntry);
            }
        }
    };

    // Should the file upload be disabled, if so return
    // the appropriate style
    const uploadDisabled = () => {
        return stateActiveMessage.text.length > 0 || stateMessages.loading
            ? cssOverrides.fileLabelDisabled ? cssOverrides.fileLabelDisabled : styles.fileLabelDisabled
            : '';
    };

    return (
        <form className={styles.messageEntryContainer}>
            <TextareaAutosize
                value={stateActiveMessage.text}
                onInput={(e) =>
                    dispatch(
                        setActiveMessageText(e.target.value)
                    )
                }
                onKeyPress={keyIsPressed}
                maxRows={maxRows}
                minRows={minRows}
                placeholder={t('Type your message')}
                className={`${cssOverrides.entryBox ? cssOverrides.entryBox : styles.entryBox} ${getStyle()}`}
            ></TextareaAutosize>
            <div className={`${cssOverrides.entryIconsContainer ? cssOverrides.entryIconsContainer : styles.entryIconsContainer} ${getStyle()}`}>
                {!stateActiveMessage.id && (
                    <div className={styles.entryIcons}>
                        <label
                            data-testid="fileattachlabel"
                            className={`${cssOverrides.fileLabel ? cssOverrides.fileLabel : styles.fileLabel
                                } ${uploadDisabled()}`}
                        >
                            <FontAwesomeIcon
                                alt={t('Create an attachment')}
                                icon="paperclip"
                            />
                            <input
                                multiple
                                data-testid="fileattach"
                                onChange={dispatchUpload}
                                disabled={
                                    stateActiveMessage.text.length > 0 ||
                                    stateMessages.loading
                                }
                                type="file"
                                className={styles.fileInput}
                                aria-label={t('File picker')}
                            />
                        </label>
                        <button
                            type="button"
                            className={cssOverrides.entryButton ? cssOverrides.entryButton : styles.entryButton}
                            onClick={dispatchSendAction}
                            disabled={
                                stateActiveMessage.text.length === 0 ||
                                stateMessages.loading
                            }
                        >
                            <FontAwesomeIcon
                                alt={t('Send message')}
                                icon="paper-plane"
                            />
                        </button>
                    </div>
                )}
                {stateActiveMessage.id && (
                    <div className={styles.entryIcons}>
                        <button
                            type="button"
                            onClick={resetEntry}
                            className={cssOverrides.entryButton ? cssOverrides.entryButton : styles.entryButton}
                        >
                            <FontAwesomeIcon
                                alt={t('Abandon changes')}
                                icon="times"
                            />
                        </button>
                        <button
                            type="button"
                            className={cssOverrides.entryButton ? cssOverrides.entryButton : styles.entryButton}
                            onClick={dispatchEditAction}
                            disabled={stateActiveMessage.text.length === 0}
                        >
                            <FontAwesomeIcon
                                alt={t('Save changes')}
                                icon="check"
                            />
                        </button>
                    </div>
                )}
            </div>
        </form >
    );
};

export default MessageEntry;
