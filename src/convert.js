import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * @param {string} inputPath  絶対パス
 * @param {string} outputPath 絶対パス
 * @returns {Promise<string>} 生成された PDF の絶対パス
 */
export async function convertHtmlToPdf(inputPath, outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'networkidle' });
    try {
      await page.evaluate(() => MathJax.typesetPromise());
    } catch (e) {
      process.stderr.write(`[html2pdf] MathJax warning: ${e.message}\n`);
    }
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    return outputPath;
  } finally {
    await browser.close();
  }
}
