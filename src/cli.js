#!/usr/bin/env node

import { Command } from 'commander';
import { resolve, dirname, basename, extname } from 'path';
import { convertHtmlToPdf } from './convert.js';

const program = new Command();
program
  .name('html2pdf')
  .description('Convert HTML files to PDF (supports MathJax and Google Fonts)')
  .argument('<input>', 'Input HTML file')
  .option('-o, --output <path>', 'Output PDF path (default: same folder as input, .pdf extension)')
  .parse(process.argv);

const [inputArg] = program.args;
const { output } = program.opts();

const inputPath = resolve(inputArg);
const outputPath = output
  ? resolve(output)
  : resolve(dirname(inputPath), basename(inputPath, extname(inputPath)) + '.pdf');

console.log(`Converting: ${inputPath}`);
console.log(`Output:     ${outputPath}`);

try {
  await convertHtmlToPdf(inputPath, outputPath);
  console.log('Done.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
