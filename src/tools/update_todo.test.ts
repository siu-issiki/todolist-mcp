import { jest } from '@jest/globals';
import { registerUpdateTodoTool } from './update_todo.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Todo } from '../models/todo.js';

describe('registerUpdateTodoTool', () => {
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    for (const k in todoStore) delete todoStore[k];
    registerUpdateTodoTool(server);
  });

  it('bodyのみ更新できる', async () => {
    const key = 'key1';
    const todo: Todo = { id: 'id1', body: 'old', completed: false, createdAt: new Date() };
    todoStore[key] = [todo];
    const result = await toolHandler({ key, id: todo.id, body: 'new' });
    expect(result.status).toBe('success');
    expect(todo.body).toBe('new');
    expect(todo.completed).toBe(false);
  });

  it('completedのみ更新できる', async () => {
    const key = 'key2';
    const todo: Todo = { id: 'id2', body: 'task', completed: false, createdAt: new Date() };
    todoStore[key] = [todo];
    const result = await toolHandler({ key, id: todo.id, completed: true });
    expect(result.status).toBe('success');
    expect(todo.completed).toBe(true);
    expect(todo.body).toBe('task');
  });

  it('bodyとcompletedを同時に更新できる', async () => {
    const key = 'key3';
    const todo: Todo = { id: 'id3', body: 'old', completed: false, createdAt: new Date() };
    todoStore[key] = [todo];
    const result = await toolHandler({ key, id: todo.id, body: 'new', completed: true });
    expect(result.status).toBe('success');
    expect(todo.body).toBe('new');
    expect(todo.completed).toBe(true);
  });

  it('存在しないIDの場合はエラー', async () => {
    const key = 'key4';
    todoStore[key] = [];
    const result = await toolHandler({ key, id: 'notfound', body: 'x' });
    expect(result.status).toBe('error');
    expect(result.content[0].text).toContain('存在しません');
  });
});
