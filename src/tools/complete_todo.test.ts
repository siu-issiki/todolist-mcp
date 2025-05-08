import { jest } from '@jest/globals';
import { registerCompleteTodoTool } from './complete_todo.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Todo } from '../models/todo.js';


describe('registerCompleteTodoTool', () => {
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    for (const k in todoStore) delete todoStore[k];
    registerCompleteTodoTool(server);
  });

  it('既存のTodoを完了状態にできる', async () => {
    const key = 'testKey';
    const todo: Todo = {
      id: 'abc123',
      body: 'やること',
      completed: false,
      createdAt: new Date(),
    };
    todoStore[key] = [todo];

    const result = await toolHandler({ key, id: todo.id });
    expect(result.status).toBe('success');
    expect(todo.completed).toBe(true);
    expect(result.content[0].text).toContain('完了');
  });

  it('存在しないTodo IDの場合はエラー', async () => {
    const key = 'testKey';
    todoStore[key] = [];
    const result = await toolHandler({ key, id: 'notfound' });
    expect(result.status).toBe('error');
    expect(result.content[0].text).toContain('存在しません');
  });
});
