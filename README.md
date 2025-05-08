# TodoList MCP サーバー

Model Context Protocol (MCP) を使用したシンプルな TodoList サーバーの実装です。

## 機能

- `add_todo` ツール: Todo を追加します
- `list_todo` ツール: Todo を一覧表示します
- `create_todo` ツール: Todo を作成します
- `update_todo` ツール: Todo を更新します
- `delete_todo` ツール: Todo を削除します
- `delete_todos` ツール: Todo を一括削除します

## インストール

```bash
npm install
```

## ビルド

```bash
npm run build
```

## 実行方法

### 標準入出力モード

```bash
npm start
```

### HTTP サーバーモード

```bash
npm start -- --http
```

HTTP サーバーはデフォルトでポート 3000 で起動します。

## 開発モード

```bash
npm run dev
```

## MCP について

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) は、LLM アプリケーションにデータと機能を安全で標準化された方法で公開するためのプロトコルです。
