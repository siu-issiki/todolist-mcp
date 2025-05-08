import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoStore } from '../models/todo_store.js';
import { Todo } from '../models/todo.js';

/**
 * update_todoツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerUpdateTodoTool(server: McpServer): void {
  server.tool(
    'update_todo',
    {
      key: z.string(),
      id: z.string(),
      body: z.string().optional(),
      completed: z.boolean().optional(),
    },
    async ({ key, id, body, completed }) => {
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
      if (typeof body === 'string') todo.body = body;
      if (typeof completed === 'boolean') todo.completed = completed;
      return {
        content: [
          { type: 'text', text: `Todo(id=${id})を更新しました。` }
        ],
        status: 'success',
      };
    }
  );
}
