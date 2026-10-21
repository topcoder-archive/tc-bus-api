/** Validate every runtime JavaScript file without executing external integrations. */
const { readdirSync } = require('node:fs')
const { join } = require('node:path')
const { execFileSync } = require('node:child_process')
/** Recursively syntax-check a source directory. Takes a path; returns void; throws on invalid JS. */
function check (directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) check(path)
    else if (/\.c?js$/.test(path)) execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' })
  }
}
for (const directory of ['common', 'controllers', 'service', 'utils', 'config', 'scripts']) check(directory)
execFileSync(process.execPath, ['--check', 'index.js'], { stdio: 'inherit' })
