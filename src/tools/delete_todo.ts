import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoStore } from '../models/todo_store.js';
import { Todo } from '../models/todo.js';

/**
 * delete_todoツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerDeleteTodoTool(server: McpServer): void {
  server.tool(
    'delete_todo',
    { key: z.string(), id: z.string() },
    async ({ key, id }) => {
      const todos: Todo[] = todoStore[key] || [];
      const idx = todos.findIndex(t => t.id === id);
      if (idx === -1) {
        return {
          content: [
            { type: 'text', text: `指定されたTodo(id=${id})は存在しません。` }
          ],
          status: 'error',
        };
      }
      todos.splice(idx, 1);
      return {
        content: [
          { type: 'text', text: `Todo(id=${id})を削除しました。` }
        ],
        status: 'success',
      };
    }
  );
}
