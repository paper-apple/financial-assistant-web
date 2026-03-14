const { spawn } = require('child_process');
const path = require('path');

console.log('Запуск проекта\n');

const backend = spawn('npm', ['run', 'start:dev'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

console.log('Frontend: http://localhost:5173');
console.log('Backend: http://localhost:3000');
console.log('\nНажмите Ctrl+C для остановки\n');