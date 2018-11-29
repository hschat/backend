DELETE FROM users WHERE hsid='test1234' OR hsid='123412345';
DELETE FROM chats WHERE chats.name like 'test%';
DELETE FROM messages WHERE system=true AND text='This is a test';
