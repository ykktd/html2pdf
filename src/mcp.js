#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { resolve, dirname, basename, extname } from 'path';
import { z } from 'zod';
import { convertHtmlToPdf } from './convert.js';

const server = new McpServer({ name: 'html2pdf', version: '1.0.0' });

server.tool(
  'convert_html_to_pdf',
  'HTML ファイルを PDF に変換する',
  {
    input_path:  z.string().describe('変換する HTML ファイルの絶対パス'),
    output_path: z.string().optional().describe('出力先 PDF の絶対パス（省略時は input と同フォルダ）'),
  },
  async ({ input_path, output_path }) => {
    const inputPath = resolve(input_path);
    const outputPath = output_path
      ? resolve(output_path)
      : resolve(dirname(inputPath), basename(inputPath, extname(inputPath)) + '.pdf');

    const result = await convertHtmlToPdf(inputPath, outputPath);
    return { content: [{ type: 'text', text: `PDF を生成しました: ${result}` }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
