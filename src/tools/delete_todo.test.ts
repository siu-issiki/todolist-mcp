import { jest } from '@jest/globals';
import { registerDeleteTodoTool } from './delete_todo.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Todo } from '../models/todo.js';

describe('registerDeleteTodoTool', () => {
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    for (const k in todoStore) delete todoStore[k];
    registerDeleteTodoTool(server);
  });

  it('既存のTodoを削除できる', async () => {
    const key = 'key1';
    const todo: Todo = { id: 'id1', body: 'test', completed: false, createdAt: new Date() };
    todoStore[key] = [todo];
    const result = await toolHandler({ key, id: todo.id });
    expect(result.status).toBe('success');
    expect(todoStore[key].length).toBe(0);
    expect(result.content[0].text).toContain('削除');
  });

  it('存在しないIDの場合はエラー', async () => {
    const key = 'key2';
    todoStore[key] = [];
    const result = await toolHandler({ key, id: 'notfound' });
    expect(result.status).toBe('error');
    expect(result.content[0].text).toContain('存在しません');
  });
});
