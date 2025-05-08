// Todoインターフェースの共通定義
export interface Todo {
  id: string;
  body: string;
  completed: boolean;
  createdAt: Date;
}
