import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            Loading: 'Loading',
            'No queries found': 'No queries found',
            'Search or start new query': 'Search or start new query',
            'Search icon': 'Search icon',
            'No messages found': 'No messages found',
            You: 'You',
            'Create an attachment': 'Create an attachment',
            'Send message': 'Send message',
            'Type your message': 'Type your message',
            'Start a new query': 'Start a new query',
            'Enter a query title': 'Enter a query title',
            'File picker': 'File picker',
            'Your queries': 'Your queries',
            'Change query folder': 'Change query folder',
            'Remove from folder': 'Remove from folder',
            Folders: 'Folders',
            folderName_UNREAD: 'Unread',
            folderName_ALL_QUERIES: 'All queries',
            folderName_ESCALATED: 'Escalated',
            folderName_COMPLETE: 'Complete',
            folderName_BIN: 'Bin',
            folderIcon_UNREAD: 'inbox',
            folderIcon_ALL_QUERIES: 'archive',
            folderIcon_ESCALATED: 'exclamation',
            folderIcon_COMPLETE: 'check',
            folderIcon_ESCALATED_CIRCLE: 'exclamation-circle',
            folderIcon_COMPLETE_CIRCLE: 'check-circle',
            folderIcon_BIN_CIRCLE: 'trash-alt',
            folderIcon_BIN: 'trash-alt',
            'Edit labels': 'Edit labels',
            'Finish editing': 'Finish editing',
            'New label': 'New label',
            'No labels defined': 'No labels defined'
        }
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
