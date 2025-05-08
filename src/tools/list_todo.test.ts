import { jest } from '@jest/globals';
import { registerListTodoTool } from './list_todo.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('registerListTodoTool', () => {
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    for (const k in todoStore) delete todoStore[k];
    registerListTodoTool(server);
  });

  it('存在するキーのTodoリストを返す', async () => {
    const key = 'listKey';
    todoStore[key] = [
      {
        id: 'id1',
        body: 'タスク1',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: 'id2',
        body: 'タスク2',
        completed: true,
        createdAt: new Date(),
      },
    ];
    const result = await toolHandler({ key });
    const todos = JSON.parse(result.content[0].text);
    expect(Array.isArray(todos)).toBe(true);
    expect(todos).toHaveLength(2);
    expect(todos[0].body).toBe('タスク1');
    expect(todos[1].completed).toBe(true);
  });

  it('存在しないキーや空リストの場合は空配列を返す', async () => {
    const key = 'notExistKey';
    const result = await toolHandler({ key });
    const todos = JSON.parse(result.content[0].text);
    expect(Array.isArray(todos)).toBe(true);
    expect(todos).toHaveLength(0);
    // 明示的に空リストをセットした場合も
    todoStore[key] = [];
    const result2 = await toolHandler({ key });
    const todos2 = JSON.parse(result2.content[0].text);
    expect(Array.isArray(todos2)).toBe(true);
    expect(todos2).toHaveLength(0);
  });
});
