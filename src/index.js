#!/usr/bin/env node

import { chromium } from 'playwright';
import { Command } from 'commander';
import { resolve, dirname, basename, extname } from 'path';
import { pathToFileURL } from 'url';

const program = new Command();

program
  .name('html2pdf')
  .description('Convert HTML files to PDF (supports MathJax and Google Fonts)')
  .argument('<input>', 'Input HTML file')
  .option('-o, --output <path>', 'Output PDF path (default: same folder as input, .pdf extension)')
  .parse(process.argv);

const [inputArg] = program.args;
const options = program.opts();

const inputPath = resolve(inputArg);
const outputPath = options.output
  ? resolve(options.output)
  : resolve(dirname(inputPath), basename(inputPath, extname(inputPath)) + '.pdf');

const fileUrl = pathToFileURL(inputPath).href;

console.log(`Converting: ${inputPath}`);
console.log(`Output:     ${outputPath}`);

let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for MathJax rendering if present
  try {
    await page.evaluate(() => MathJax.typesetPromise());
  } catch {
    // MathJax not present, skip
  }

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  console.log('Done.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  await browser?.close();
}
