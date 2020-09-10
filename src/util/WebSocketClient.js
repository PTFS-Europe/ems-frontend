import {
    receiveCreatedMessage,
    editMessageSuccess,
    deleteMessageSuccess,
    dispatchIfActiveQuery,
    receiveUploadedFiles,
} from '../store/messages/messagesActions';
import {
    updateQueryBulkSuccess,
} from '../store/queries/queriesActions';
import {
    setFoldersCounts,
} from '../store/folders/foldersActions';
import {
    updateUnseenCounts,
    updateMostRecentSeenSuccess
} from '../store/unseen/unseenActions';
import api from './EmsApi';

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.dispatch = null;
    }
    connect(dispatch) {
        this.dispatch = dispatch;

        this.socket = new WebSocket(
            process.env.REACT_APP_WS_BASE,
            api.token
        );

        // Create a message handler
        this.socket.onmessage = (event) => {
            this.messageDispatcher(JSON.parse(event.data));
        };
    }
    messageDispatcher({ initiator, subject, action, payload }) {
        switch (subject) {
            case 'message':
                if (action === 'create') {
                    this.dispatch(
                        dispatchIfActiveQuery(
                            () => receiveCreatedMessage(payload),
                            payload.query_id
                        )
                    );
                } else if (action === 'update') {
                    this.dispatch(
                        dispatchIfActiveQuery(
                            () => editMessageSuccess(payload),
                            payload.query_id
                        )
                    );
                } else if (action === 'delete') {
                    this.dispatch(
                        dispatchIfActiveQuery(
                            () => deleteMessageSuccess(payload),
                            payload.query_id
                        )
                    );
                }
                break;
            case 'query':
                if (action === 'update') {
                    this.dispatch(updateQueryBulkSuccess({ data: payload }));
                }
                break;
            case 'upload':
                if (action === 'create') {
                    this.dispatch(
                        dispatchIfActiveQuery(
                            () => receiveUploadedFiles(payload),
                            payload[0].query_id
                        )
                    );
                }
                break;
            case 'unseenCount':
                if (action === 'update') {
                    this.dispatch(updateUnseenCounts(payload));
                }
                break;
            case 'mostRecentSeen':
                if (action === 'update') {
                    this.dispatch(updateMostRecentSeenSuccess(payload));
                }
                break;
            case 'folderCount':
                if (action === 'update') {
                    this.dispatch(setFoldersCounts(payload));
                }
                break;
            default:
                return;
        }
    }
}

const singleton = new WebSocketClient();

export default singleton;