#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { resolve, join } from 'path';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
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
    output_path:  z.string().optional().describe('出力 PDF を保存したい場合の絶対パス（省略時は一時ファイルに書き出して返す）'),
  },
  async ({ input_path, html_content, output_path }) => {
    if (!input_path && !html_content) {
      throw new Error('input_path か html_content のどちらかを指定してください');
    }

    const ts = Date.now();
    const tempInput  = html_content ? join(tmpdir(), `html2pdf_${ts}.html`) : null;
    const tempOutput = join(tmpdir(), `html2pdf_${ts}.pdf`);
    const finalOutput = output_path ? resolve(output_path) : tempOutput;

    if (html_content) {
      writeFileSync(tempInput, html_content, 'utf8');
    }

    const inputPath = tempInput ?? resolve(input_path);

    try {
      await convertHtmlToPdf(inputPath, finalOutput);
      const pdfData = readFileSync(finalOutput).toString('base64');
      return {
        content: [
          {
            type: 'resource',
            resource: {
              uri: `file://${finalOutput}`,
              mimeType: 'application/pdf',
              blob: pdfData,
            },
          },
          { type: 'text', text: output_path ? `PDF を保存しました: ${finalOutput}` : 'PDF を生成しました（base64 で返却）' },
        ],
      };
    } finally {
      if (tempInput)  try { unlinkSync(tempInput); }  catch {}
      if (!output_path) try { unlinkSync(tempOutput); } catch {}
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
