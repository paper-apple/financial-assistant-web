require("dotenv").config();
const { execSync } = require("child_process");

const DUMP_PATH = "db/neon_dump.dump";
const CONTAINER = "project_postgres";
const DB_NAME = process.env.DB_NAME || "myapp";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

console.log("Копирование дампа в контейнер");
run(`docker cp ${DUMP_PATH} ${CONTAINER}:/neon_dump.dump`);

console.log("Очистка схемы");
run(
  `docker exec -it ${CONTAINER} sh -c "psql -U postgres -d ${DB_NAME} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'"`
);

console.log("Восстановление базы");
run(
  `docker exec -it ${CONTAINER} sh -c "pg_restore -U postgres -d ${DB_NAME} --no-owner --role=postgres /neon_dump.dump || true"`
);

console.log("\nБаза восстановлена");
