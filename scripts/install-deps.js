// install-deps.js
const { execSync } = require("child_process");
const path = require("path");

function run(cmd, cwd = process.cwd()) {
  execSync(cmd, { stdio: "inherit", cwd });
}

const root = path.resolve(__dirname, "..");
const backend = path.join(root, "backend");
const frontend = path.join(root, "frontend");

console.log("Установка зависимостей");

run("npm install", root);
run("npm install", backend);
run("npm install", frontend);

console.log("\nЗависимости установлены");
