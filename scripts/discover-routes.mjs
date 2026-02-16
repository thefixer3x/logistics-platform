import fs from 'fs/promises';
import path from 'path';

const ROUTES_DIR = path.join(process.cwd(), 'app');
const OUTPUT_FILE = path.join(process.cwd(), 'reports/routes.json');
const OUTPUT_DIR = path.dirname(OUTPUT_FILE);

async function discoverRoutes(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // Ignore auth directory for now, assuming it's a special case
      if (entry.name === '(auth)') {
        continue;
      }
      routes.push(...await discoverRoutes(fullPath));
    } else if (entry.isFile() && (entry.name.startsWith('page.') || entry.name.startsWith('route.')) && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const routePath = path.relative(ROUTES_DIR, fullPath)
        .replace(/\\/g, '/')
        .replace(/\/?(page|route)\.(ts|tsx)$/, '') || '/';
      
      const routeType = entry.name.startsWith('page.') ? 'page' : 'api';

      routes.push({
        path: `/${routePath}`.replace(/\/+/g, '/'),
        type: routeType,
        file: path.relative(process.cwd(), fullPath).replace(/\\/g, '/'),
      });
    }
  }

  return routes;
}

async function main() {
  try {
    const routes = await discoverRoutes(ROUTES_DIR);
    
    // Ensure the output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Write the routes to the output file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(routes, null, 2));
    
    console.log(`Route map generated successfully at ${OUTPUT_FILE}`);
    console.log(`Discovered ${routes.length} routes.`);

  } catch (error) {
    console.error('Error generating route map:', error);
    process.exit(1);
  }
}

main();