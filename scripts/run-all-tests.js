// run-all-tests.js
const { execSync } = require("child_process");
const path = require("path");

function run(cmd, cwd = process.cwd()) {
  execSync(cmd, { stdio: "inherit", cwd });
}

const root = path.resolve(__dirname, "..");
const backend = path.join(root, "backend");
const frontend = path.join(root, "frontend");

run("npm run test:run src/tests", backend);
run("npx vitest --run src/tests", frontend);
