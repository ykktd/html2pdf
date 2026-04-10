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

## ライセンス

MIT
