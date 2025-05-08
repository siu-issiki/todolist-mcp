// Todoリストを管理するインメモリデータストアの共通定義
import { Todo } from './todo.js';

export interface TodoStore {
  [key: string]: Todo[];
}

export const todoStore: TodoStore = {};
