import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// 共通Todoインターフェース
import { Todo } from '../models/todo.js';

// 共通TodoStoreインターフェースとインメモリストア
import { todoStore } from '../models/todo_store.js';

// UUIDを生成する関数
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * create_todoツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerCreateTodoTool(server: McpServer): void {
  server.tool(
    'create_todo',
    {
      key: z.string(),
      body: z.string(),
      afterId: z.string().optional(),
    },
    async ({ key, body, afterId }) => {
      // キーが存在しない場合は新しい配列を作成
      if (!todoStore[key]) {
        todoStore[key] = [];
      }

      // 新しいTodoを作成
      const newTodo: Todo = {
        id: generateId(),
        body,
        completed: false,
        createdAt: new Date(),
      };

      if (afterId) {
        const idx = todoStore[key].findIndex(t => t.id === afterId);
        if (idx !== -1) {
          todoStore[key].splice(idx + 1, 0, newTodo);
        } else {
          todoStore[key].push(newTodo); // afterIdが見つからなければ末尾追加
        }
      } else {
        todoStore[key].push(newTodo);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Todoが作成されました。\nキー: ${key}\nID: ${newTodo.id}\n内容: ${newTodo.body}`,
          },
        ],
      };
    }
  );
}
