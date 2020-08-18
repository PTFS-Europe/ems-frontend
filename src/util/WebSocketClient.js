import {
    receiveCreatedMessage,
    editMessageSuccess,
    deleteMessageSuccess,
    dispatchIfActiveQuery,
    receiveUploadedFiles
} from '../store/messages/messagesActions';
import {
    updateQueryBulkSuccess
} from '../store/queries/queriesActions';
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
            case 'upload':
                if (action === 'create') {
                    this.dispatch(
                        dispatchIfActiveQuery(
                            () => receiveUploadedFiles(payload),
                            payload[0].query_id
                        )
                    );
                }
            default:
                return;
        }
    }
}

const singleton = new WebSocketClient();

export default singleton;