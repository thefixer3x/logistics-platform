import { exec } from 'child_process';

const runCommand = (command) => {
  return new Promise((resolve) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        // Don't exit, just resolve so the summary can report the failure
        resolve({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
};

async function main() {
    console.log('Running CI checks...');

    console.log('\nStep 1: Discovering routes...');
    await runCommand('bun run discover-routes');

    console.log('\nStep 2: Running API contract tests...');
    await runCommand('bun test');

    console.log('\nStep 3: Checking for broken links...');
    // Note: This will fail if the dev server is not running.
    // In a real CI environment, you would start the server in the background.
    await runCommand('bun run check-links');

    console.log('\nStep 4: Running E2E tests...');
    // Note: This will fail if the dev server is not running and
    // if the system dependencies are not installed.
    await runCommand('bun run test:e2e');

    console.log('\nStep 5: Generating summary report...');
    await runCommand('bun scripts/generate-summary-report.mjs');

    console.log('\nCI checks script finished.');
}

main();