# html2pdf

MathJax 数式・Google Fonts を含む HTML ファイルを、Playwright (Chromium) を使って PDF に変換する CLI ツールです。

## 必要な環境

- Node.js 18 以降
- Chromium は初回実行時に自動ダウンロードされます（約 165 MB）

## インストール

```bash
# npm
npm install -g html2pdf-tool

# pnpm
pnpm add -g html2pdf-tool
```

## 使い方

```bash
# 基本：同じフォルダに input.pdf が生成される
html2pdf input.html

# 出力先を指定
html2pdf input.html -o ~/Documents/output.pdf
```

## インストールなしで実行

```bash
npx html2pdf-tool input.html
```

## 仕組み

1. headless Chromium で HTML ファイルを開く
2. すべてのネットワークリクエストが完了するまで待機（`networkidle`）― Google Fonts の読み込みを確実にする
3. MathJax が含まれる場合は `MathJax.typesetPromise()` の完了を待機
4. A4 サイズ・背景色あり で PDF に書き出す

## なぜブラウザの印刷（⌘+P）ではダメなのか

ブラウザの印刷ダイアログを使うと、ヘッダー・フッター・日付・URL が付加されます。このツールを使えばそれらを含まないクリーンな PDF が生成されます。

## MCP サーバーとして使う（Claude デスクトップアプリ連携）

`html2pdf-mcp` コマンドが MCP サーバーとして機能します。
Claude デスクトップアプリから直接 PDF 変換を呼び出せるようになります。

### 登録手順

`~/Library/Application Support/Claude/claude_desktop_config.json` に以下を追記してください。

```json
{
  "mcpServers": {
    "html2pdf": {
      "command": "html2pdf-mcp"
    }
  }
}
```

> グローバルインストール後は `html2pdf-mcp` コマンドが使えます。
> `npx` で使う場合は `"command": "npx"`, `"args": ["-y", "html2pdf-tool/src/mcp.js"]` のようにしてください。

### 公開ツール：`convert_html_to_pdf`

| 引数 | 説明 |
|---|---|
| `input_path` | 変換する HTML ファイルの絶対パス（必須） |
| `output_path` | 出力先 PDF の絶対パス（省略時は input と同フォルダ） |

変換完了後、生成された PDF の絶対パスが返ります。

---

## ライセンス

MIT
