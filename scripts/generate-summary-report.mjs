import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const REPORTS_DIR = path.join(process.cwd(), 'reports');

async function main() {
  console.log('\nGenerating final summary report...');

  let summary = '## CI Test & Validation Summary\n\n';
  let overallStatus = '✅ All checks passed';

  // 1. API Contract Tests (Jest)
  try {
    const jestReportPath = path.join(REPORTS_DIR, 'jest-report.xml');
    const xmlData = await fs.readFile(jestReportPath, 'utf-8');
    const parser = new XMLParser();
    const report = parser.parse(xmlData);
    const testsuite = report.testsuites.testsuite;
    const total = testsuite['@_tests'];
    const failures = testsuite['@_failures'];
    const skipped = testsuite['@_skipped'];
    const passed = total - failures - skipped;
    summary += `### API Contract Tests\n- **Result:** ${failures > 0 ? '❌ Failed' : '✅ Passed'}\n- **Summary:** ${passed}/${total} tests passed.\n\n`;
    if (failures > 0) overallStatus = '❌ Checks failed';
  } catch (e) {
    summary += '### API Contract Tests\n- **Result:** ⚠️ Could not parse report.\n\n';
  }

  // 2. Broken Link Check
  try {
    const linkReportPath = path.join(REPORTS_DIR, 'link-report.json');
    const report = JSON.parse(await fs.readFile(linkReportPath, 'utf-8'));
    if (report.status === 'failed') {
      summary += `### Broken Link Check\n- **Result:** ❌ Failed\n- **Summary:** Found ${report.brokenLinks.length} broken links and ${report.crawlErrors} crawl errors.\n\n`;
      overallStatus = '❌ Checks failed';
    } else {
      summary += `### Broken Link Check\n- **Result:** ✅ Passed\n\n`;
    }
  } catch (e) {
    summary += '### Broken Link Check\n- **Result:** ⚠️ Could not parse report.\n\n';
  }

  // 3. E2E Tests (Playwright)
  try {
    const playwrightReportPath = path.join(REPORTS_DIR, 'playwright-report.json');
    const report = JSON.parse(await fs.readFile(playwrightReportPath, 'utf-8'));
    const stats = report.stats;
    const passed = stats.expected;
    const failed = stats.unexpected;
    const total = passed + failed;
    summary += `### E2E Tests\n- **Result:** ${failed > 0 ? '❌ Failed' : '✅ Passed'}\n- **Summary:** ${passed}/${total} tests passed.\n\n`;
    if (failed > 0) overallStatus = '❌ Checks failed';
  } catch (e) {
    summary += '### E2E Tests\n- **Result:** ⚠️ Could not parse report. (Did they run? Check for environment issues).\n\n';
  }

  summary = `**Overall Status:** ${overallStatus}\n\n` + summary;

  await fs.writeFile(path.join(REPORTS_DIR, 'summary-report.md'), summary);
  console.log('Summary report generated at reports/summary-report.md');
  console.log('\n' + summary);

  if (overallStatus.includes('❌')) {
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Failed to generate summary report:', err);
  process.exit(1);
});