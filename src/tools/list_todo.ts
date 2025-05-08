import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoStore } from '../models/todo_store.js';
import { Todo } from '../models/todo.js';

/**
 * list_todoツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerListTodoTool(server: McpServer): void {
  server.tool(
    'list_todo',
    { key: z.string() },
    async ({ key }) => {
      const todos: Todo[] = todoStore[key] || [];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(todos.map(todo => ({
              id: todo.id,
              body: todo.body,
              completed: todo.completed,
              createdAt: todo.createdAt,
            }))),
          },
        ],
      };

    }
  );
}
