// restore-db.js
const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');

// Чтение .env файла
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();

const DUMP_PATH = "db/neon_dump.dump";
const CONTAINER = "project_postgres";
const DB_NAME = process.env.DB_NAME || "financial_assistant_db";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

console.log("Копирование дампа в контейнер");
run(`docker cp ${DUMP_PATH} ${CONTAINER}:/neon_dump.dump`);

console.log("Очистка схемы");
run(
  `docker exec -it ${CONTAINER} sh -c "psql -U postgres -d ${DB_NAME} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'"`
);

console.log("Восстановление базы данных");
run(
  `docker exec -it ${CONTAINER} sh -c "pg_restore -U postgres -d ${DB_NAME} /neon_dump.dump 2>/dev/null || true"`
);

console.log("\nБаза данных восстановлена");
