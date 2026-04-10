import { chromium } from 'playwright';
import { pathToFileURL } from 'url';

/**
 * @param {string} inputPath  絶対パス
 * @param {string} outputPath 絶対パス
 * @returns {Promise<string>} 生成された PDF の絶対パス
 */
export async function convertHtmlToPdf(inputPath, outputPath) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'networkidle' });
    try { await page.evaluate(() => MathJax.typesetPromise()); } catch {}
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    return outputPath;
  } finally {
    await browser.close();
  }
}
