import { jest } from '@jest/globals';
import { registerCreateTodoTool } from './create_todo.js';
import { todoStore } from '../models/todo_store.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('registerCreateTodoTool', () => {
  it('afterId未指定時は末尾に追加される', async () => {
    const key = 'orderKey';
    todoStore[key] = [
      { id: 'a', body: 'A', completed: false, createdAt: new Date() },
      { id: 'b', body: 'B', completed: false, createdAt: new Date() },
    ];
    const result = await toolHandler({ key, body: 'C' });
    expect(todoStore[key][2].body).toBe('C');
  });

  it('afterId指定時はその直後に追加される', async () => {
    const key = 'orderKey2';
    todoStore[key] = [
      { id: 'a', body: 'A', completed: false, createdAt: new Date() },
      { id: 'b', body: 'B', completed: false, createdAt: new Date() },
    ];
    const result = await toolHandler({ key, body: 'C', afterId: 'a' });
    expect(todoStore[key][1].body).toBe('C');
    expect(todoStore[key][2].body).toBe('B');
  });

  it('afterIdが見つからない場合は末尾に追加される', async () => {
    const key = 'orderKey3';
    todoStore[key] = [
      { id: 'a', body: 'A', completed: false, createdAt: new Date() },
      { id: 'b', body: 'B', completed: false, createdAt: new Date() },
    ];
    const result = await toolHandler({ key, body: 'C', afterId: 'notfound' });
    expect(todoStore[key][2].body).toBe('C');
  });
  let server: McpServer;
  let toolHandler: any;

  beforeEach(() => {
    // モックサーバーを作成
    server = {
      tool: jest.fn((name, schema, handler) => {
        toolHandler = handler;
      }),
    } as unknown as McpServer;
    // ストア初期化
    for (const k in todoStore) delete todoStore[k];
    registerCreateTodoTool(server);
  });

  it('新しいキーでTodoを作成できる', async () => {
    const key = 'testKey';
    const body = 'テストタスク';
    const result = await toolHandler({ key, body });
    expect(todoStore[key]).toHaveLength(1);
    expect(todoStore[key][0].body).toBe(body);
    expect(result.content[0].text).toContain('Todoが作成されました');
  });

  it('既存キーにTodoを追加できる', async () => {
    const key = 'existKey';
    todoStore[key] = [
      {
        id: 'dummy',
        body: '既存タスク',
        completed: false,
        createdAt: new Date(),
      },
    ];
    const body = '新しいタスク';
    await toolHandler({ key, body });
    expect(todoStore[key]).toHaveLength(2);
    expect(todoStore[key][1].body).toBe(body);
  });

  it('Todoのid, completed, createdAtが正しくセットされる', async () => {
    const key = 'metaKey';
    const body = 'メタ情報テスト';
    await toolHandler({ key, body });
    const todo = todoStore[key][0];
    expect(typeof todo.id).toBe('string');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
  });
});
