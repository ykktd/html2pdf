# html2pdf-tool

Convert HTML files to PDF via Playwright (Chromium). Supports MathJax math rendering and Google Fonts.

## Requirements

- Node.js 18 or later
- Chromium is downloaded automatically on first run (~165 MB)

## Install

```bash
# npm
npm install -g html2pdf-tool

# pnpm
pnpm add -g html2pdf-tool
```

## Usage

```bash
# Basic: generates input.pdf in the same folder
html2pdf input.html

# Specify output path
html2pdf input.html -o ~/Documents/output.pdf
```

## Run without installing

```bash
npx html2pdf-tool input.html
```

## How it works

1. Opens the HTML file in headless Chromium
2. Waits for all network requests to finish (`networkidle`) — ensures Google Fonts load
3. Waits for `MathJax.typesetPromise()` to complete if MathJax is present
4. Exports to PDF (A4, with background colors/images)

## Why not just use browser Print (Cmd+P)?

The browser's built-in print dialog adds headers, footers, dates, and URLs to the page. This tool produces a clean PDF with none of that.

## License

MIT
