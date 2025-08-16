import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const REPORTS_DIR = path.join(process.cwd(), 'reports');
const ROUTES_FILE = path.join(REPORTS_DIR, 'routes.json');
const ALLOW_LIST_FILE = path.join(process.cwd(), 'link-allow-list.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'link-report.json');
const BASE_URL = 'http://localhost:3000'; // Assume dev server is running

async function main() {
  console.log('Starting link checker...');
  await fs.mkdir(REPORTS_DIR, { recursive: true });

  // 1. Load routes and allow-list
  const routes = JSON.parse(await fs.readFile(ROUTES_FILE, 'utf-8'));
  const allowList = JSON.parse(await fs.readFile(ALLOW_LIST_FILE, 'utf-8'));
  const appRoutes = new Set(Object.keys(routes));
  const externalAllowSet = new Set(allowList.external);

  const pageRoutes = Object.entries(routes).filter(([, info]) => info.type === 'page');
  const brokenLinks = [];
  let crawlErrors = 0;

  console.log(`Found ${pageRoutes.length} page routes to crawl.`);

  // 2. Crawl each page route
  for (const [route] of pageRoutes) {
    const url = `${BASE_URL}${route}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[WARN] Could not fetch ${url}. Status: ${response.status}`);
        crawlErrors++;
        continue;
      }
      const html = await response.text();
      const $ = cheerio.load(html);
      const links = $('a');

      links.each((i, link) => {
        const href = $(link).attr('href');
        if (!href) return;

        // 3. Check link validity
        if (href.startsWith('http')) {
          // External link
          if (!externalAllowSet.has(href)) {
            brokenLinks.push({ page: route, link: href, reason: 'Not in allow-list' });
          }
        } else if (href.startsWith('/')) {
          // Internal link
          if (!appRoutes.has(href)) {
            brokenLinks.push({ page: route, link: href, reason: 'Internal route not found' });
          }
        }
        // Ignore mailto, tel, etc.
      });
    } catch (error) {
      console.error(`[ERROR] Failed to crawl ${url}:`, error.message);
      crawlErrors++;
    }
  }

  // 4. Report results
  if (brokenLinks.length > 0 || crawlErrors > 0) {
    console.error('\nLink check failed.');
    if (brokenLinks.length > 0) {
      console.error('Found broken or disallowed links:');
      console.table(brokenLinks);
    }
    if (crawlErrors > 0) {
        console.error(`${crawlErrors} page(s) could not be crawled. Is the dev server running?`);
    }
    await fs.writeFile(REPORT_FILE, JSON.stringify({ status: 'failed', brokenLinks, crawlErrors }, null, 2));
    process.exit(1);
  } else {
    console.log('\nNo broken links found. All good!');
    await fs.writeFile(REPORT_FILE, JSON.stringify({ status: 'passed', brokenLinks: [], crawlErrors: 0 }, null, 2));
  }
}

main().catch(err => {
  console.error('Link checker script failed:', err);
  process.exit(1);
});