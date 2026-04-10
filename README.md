# html2pdf

MathJax 数式・Google Fonts を含む HTML ファイルを PDF に変換する CLI ツールです。
ブラウザの印刷（⌘+P）と違い、ヘッダー・フッター・日付・URL が付かないクリーンな PDF を生成します。

## 必要な環境

- Node.js 18 以降
- Chromium は初回インストール時に自動ダウンロードされます（約 165 MB）

## インストール

```bash
# npm
npm install -g html2pdf-tool

# pnpm
pnpm add -g html2pdf-tool
```

インストールせずに使う場合：

```bash
npx html2pdf-tool input.html
```

## CLI の使い方

```bash
# 基本：同じフォルダに input.pdf が生成される
html2pdf input.html

# 出力先を指定
html2pdf input.html -o ~/Documents/output.pdf
```

## Claude デスクトップアプリと連携する

グローバルインストール後、`~/Library/Application Support/Claude/claude_desktop_config.json` に以下を追記すると、Claude から直接 PDF 変換を呼び出せるようになります。

```json
{
  "mcpServers": {
    "html2pdf": {
      "command": "html2pdf-mcp"
    }
  }
}
```

## 仕組み

1. headless Chromium で HTML ファイルを開く
2. すべてのネットワークリクエストが完了するまで待機（`networkidle`）― Google Fonts の読み込みを確実にする
3. MathJax が含まれる場合は `MathJax.typesetPromise()` の完了を待機
4. A4 サイズ・背景色あり で PDF に書き出す

## ライセンス

MIT
