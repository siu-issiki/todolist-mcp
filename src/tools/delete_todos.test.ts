import { jest } from '@jest/globals';
import { registerDeleteTodosTool } from './delete_todos.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Todo } from '../models/todo.js';

describe('registerDeleteTodosTool', () => {
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    for (const k in todoStore) delete todoStore[k];
    registerDeleteTodosTool(server);
  });

  it('複数Todoがある場合に全削除できる', async () => {
    const key = 'key1';
    const todos: Todo[] = [
      { id: 'id1', body: 'A', completed: false, createdAt: new Date() },
      { id: 'id2', body: 'B', completed: true, createdAt: new Date() }
    ];
    todoStore[key] = todos;
    const result = await toolHandler({ key });
    expect(result.status).toBe('success');
    expect(todoStore[key].length).toBe(0);
    expect(result.content[0].text).toContain('全て削除');
  });

  it('既に空の場合も成功メッセージ', async () => {
    const key = 'key2';
    todoStore[key] = [];
    const result = await toolHandler({ key });
    expect(result.status).toBe('success');
    expect(result.content[0].text).toContain('既に空');
  });
});
