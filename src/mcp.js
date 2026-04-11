#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { resolve, dirname, basename, extname, join } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { z } from 'zod';
import { convertHtmlToPdf } from './convert.js';

const server = new McpServer({ name: 'html2pdf', version: '1.0.0' });

server.tool(
  'convert_html_to_pdf',
  'HTML ファイルを PDF に変換する',
  {
    input_path:   z.string().optional().describe('変換する HTML ファイルの絶対パス（html_content と排他）'),
    html_content: z.string().optional().describe('HTML の文字列（input_path の代わりに指定可）'),
    output_path:  z.string().optional().describe('出力先 PDF の絶対パス（省略時は input と同フォルダ）'),
  },
  async ({ input_path, html_content, output_path }) => {
    if (!input_path && !html_content) {
      throw new Error('input_path か html_content のどちらかを指定してください');
    }

    let inputPath;
    let tempFile = null;

    if (html_content) {
      tempFile = join(tmpdir(), `html2pdf_${Date.now()}.html`);
      writeFileSync(tempFile, html_content, 'utf8');
      inputPath = tempFile;
    } else {
      inputPath = resolve(input_path);
    }

    const outputPath = output_path
      ? resolve(output_path)
      : resolve(dirname(inputPath), basename(inputPath, extname(inputPath)) + '.pdf');

    try {
      const result = await convertHtmlToPdf(inputPath, outputPath);
      return { content: [{ type: 'text', text: `PDF を生成しました: ${result}` }] };
    } finally {
      if (tempFile) {
        try { unlinkSync(tempFile); } catch {}
      }
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
