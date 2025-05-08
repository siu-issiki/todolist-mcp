import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// toolsモジュールからの機能をインポート
import { registerCreateTodoTool } from './tools/create_todo.js';
import { registerListTodoTool } from './tools/list_todo.js';
import { registerCompleteTodoTool } from './tools/complete_todo.js';
import { registerDeleteTodoTool } from './tools/delete_todo.js';
import { registerDeleteTodosTool } from './tools/delete_todos.js';
import { registerUpdateTodoTool } from './tools/update_todo.js';

const server = new McpServer({
  name: 'todolist-server',
  version: '1.0.0',
});

// create_todoツールを登録
registerCreateTodoTool(server);
registerListTodoTool(server);
registerCompleteTodoTool(server);
registerDeleteTodoTool(server);
registerDeleteTodosTool(server);
registerUpdateTodoTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
