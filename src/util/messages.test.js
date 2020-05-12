import messageCollections from './messages';

const mockMessages = [
    {
        id: 4,
        query_id: 33,
        creator_id: 1,
        content:
            "Hi - I'd like to order some chippies and two pea fritters please",
        created_at: '2020-05-04 11:56:49.75614+01',
        updated_at: '2020-05-04 11:56:49.75614+01',
        filename: null
    },
    {
        id: 5,
        query_id: 33,
        creator_id: 2,
        content:
            "Sure, though I've some bad news, we just sold the last pea fritter",
        created_at: '2020-05-04 11:57:18.972605+01',
        updated_at: '2020-05-04 11:57:18.972605+01',
        filename: null
    },
    {
        id: 6,
        query_id: 33,
        creator_id: 2,
        content: "We won't have any new ones until tomorrow",
        created_at: '2020-05-04 11:57:31.165191+01',
        updated_at: '2020-05-04 11:57:31.165191+01',
        filename: null
    },
    {
        id: 7,
        query_id: 33,
        creator_id: 1,
        content: '<faints>',
        created_at: '2020-05-04 11:57:41.695374+01',
        updated_at: '2020-05-04 11:57:41.695374+01',
        filename: null
    },
    {
        id: 8,
        query_id: 33,
        creator_id: 1,
        content: "OK, that's a bit troubling. What else do you have?",
        created_at: '2020-05-04 11:58:01.251987+01',
        updated_at: '2020-05-04 11:58:01.251987+01',
        filename: null
    }
];

test('returns empty array if no messages passed', () => {
    expect(messageCollections([])).toEqual([]);
});

test('returns correct number of collections', () => {
    expect(messageCollections(mockMessages)).toHaveLength(3);
});

test('first collection contains correct number of messages', () => {
    expect(messageCollections(mockMessages)[0].messages).toHaveLength(1);
});

test('second collection contains correct number of messages', () => {
    expect(messageCollections(mockMessages)[1].messages).toHaveLength(2);
});

test('second collection timestamp equals that of the last message', () => {
    const resp = messageCollections(mockMessages);
    const msg = resp[1].messages;
    expect(resp[1].timestamp).toEqual(msg[msg.length - 1].created_at);
});

test('second collection sender equals that of the last message', () => {
    const resp = messageCollections(mockMessages);
    const msg = resp[1].messages;
    expect(resp[1].sender).toEqual(msg[msg.length - 1].creator_id);
});

test('third collection contains correct number of messages', () => {
    expect(messageCollections(mockMessages)[2].messages).toHaveLength(2);
});
