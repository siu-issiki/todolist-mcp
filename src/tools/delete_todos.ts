import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoStore } from '../models/todo_store.js';

/**
 * delete_todosツールを登録する関数
 * @param server MCPサーバーインスタンス
 */
export function registerDeleteTodosTool(server: McpServer): void {
  server.tool(
    'delete_todos',
    { key: z.string() },
    async ({ key }) => {
      if (!todoStore[key] || todoStore[key].length === 0) {
        return {
          content: [
            { type: 'text', text: `指定されたキー(${key})のTodoリストは既に空です。` }
          ],
          status: 'success',
        };
      }
      todoStore[key] = [];
      return {
        content: [
          { type: 'text', text: `キー(${key})のTodoリストを全て削除しました。` }
        ],
        status: 'success',
      };
    }
  );
}
