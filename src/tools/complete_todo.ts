import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoStore } from '../models/todo_store.js';
import { Todo } from '../models/todo.js';

/**
 * complete_todoツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerCompleteTodoTool(server: McpServer): void {
  server.tool(
    'complete_todo',
    { key: z.string(), id: z.string() },
    async ({ key, id }) => {
      const todos: Todo[] = todoStore[key] || [];
      const todo = todos.find(t => t.id === id);
      if (!todo) {
        return {
          content: [
            { type: 'text', text: `指定されたTodo(id=${id})は存在しません。` }
          ],
          status: 'error',
        };
      }
      todo.completed = true;
      return {
        content: [
          { type: 'text', text: `Todo(id=${id})を完了にしました。` }
        ],
        status: 'success',
      };
    }
  );
}
