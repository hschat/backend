DELETE FROM users WHERE hsid like 'test12%' OR hsid='123412345';
DELETE FROM chats WHERE chats.name like 'test%' OR description='testtest';
DELETE FROM messages WHERE system=true AND text='This is a test';
