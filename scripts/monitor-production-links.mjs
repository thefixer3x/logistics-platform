import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

// This would be your production URL
const BASE_URL = process.env.PRODUCTION_URL || 'https://your-production-app.com';

async function main() {
  console.log(`Starting production link monitoring for ${BASE_URL}...`);

  const brokenLinks = [];
  const pagesToCrawl = new Set(['/']); // Start with the homepage
  const crawledPages = new Set();

  while (pagesToCrawl.size > 0) {
    const [route] = pagesToCrawl;
    pagesToCrawl.delete(route);
    crawledPages.add(route);

    const url = `${BASE_URL}${route}`;
    console.log(`Crawling ${url}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        brokenLinks.push({ page: route, link: url, reason: `HTTP Status ${response.status}` });
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const links = $('a');

      links.each((i, link) => {
        const href = $(link).attr('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        const nextRoute = new URL(href, url).pathname;
        if (!crawledPages.has(nextRoute)) {
          pagesToCrawl.add(nextRoute);
        }
      });
    } catch (error) {
      brokenLinks.push({ page: route, link: url, reason: `Crawl failed: ${error.message}` });
    }
  }

  if (brokenLinks.length > 0) {
    console.error('\nFound broken links in production:');
    console.table(brokenLinks);
    // In a real monitoring setup, you would send an alert here (e.g., to Sentry, PagerDuty, Slack)
    process.exit(1);
  } else {
    console.log('\nProduction link monitoring complete. No broken links found.');
  }
}

main().catch(err => {
  console.error('Production monitoring script failed:', err);
  process.exit(1);
});