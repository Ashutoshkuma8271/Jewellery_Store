import { spawn } from 'node:child_process';
import net from 'node:net';
import dotenv from 'dotenv';

dotenv.config();

const cwd = process.cwd();
const isWindows = process.platform === 'win32';
const shell = isWindows ? 'powershell.exe' : '/bin/sh';
const shellArgs = isWindows ? ['-NoProfile', '-Command'] : ['-c'];

const backendPort = process.env.PORT || 4001;
const frontendPort = process.env.VITE_PORT || 5174;
const frontendUrl = `http://localhost:${frontendPort}`;

const runCommand = (command) =>
  new Promise((resolve) => {
    const child = spawn(shell, [...shellArgs, command], {
      cwd,
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => resolve(code ?? 0));
    child.on('error', () => resolve(0));
  });

const killPorts = async () => {
  // Use non-interactive npx with --yes flag or graceful socket timeout to prevent terminal hanging
  if (isWindows) {
    await runCommand(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${backendPort},${frontendPort},3000,5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`);
  } else {
    await runCommand(`npx --yes kill-port ${backendPort} ${frontendPort} 3000 5173`);
  }
};

const spawnChild = (scriptName) =>
  spawn(shell, [...shellArgs, `npm run ${scriptName}`], {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

const waitForPort = (port, timeout = 10000) => {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      const socket = net.connect(port, '127.0.0.1');
      socket.on('connect', () => {
        socket.end();
        resolve(true);
      });
      socket.on('error', () => {
        if (Date.now() - startTime > timeout) {
          resolve(false);
        } else {
          setTimeout(check, 150);
        }
      });
    };
    check();
  });
};

const stopAll = (childProcesses) => {
  childProcesses.forEach((child) => {
    if (child && !child.killed) {
      child.kill('SIGTERM');
    }
  });
};

const main = async () => {
  await killPorts();

  console.log(`🚀 Launching LUXE Backend on port ${backendPort}...`);
  const backend = spawnChild('dev:backend');

  // Wait until backend port 4001 is listening before launching frontend
  await waitForPort(backendPort);
  console.log(`✅ Backend listening on port ${backendPort}. Launching Vite Frontend on port ${frontendPort}...`);

  const frontend = spawnChild('dev:frontend');
  const children = [backend, frontend];

  // Open browser after frontend starts
  if (isWindows) {
    setTimeout(() => {
      console.log(`🌐 Opening frontend browser at ${frontendUrl}...`);
      runCommand(`Start-Process "${frontendUrl}"`);
    }, 1500);
  } else {
    setTimeout(() => {
      console.log(`🌐 Opening frontend browser at ${frontendUrl}...`);
      runCommand(`python -m webbrowser "${frontendUrl}"`);
    }, 1500);
  }

  const shutdown = (signal) => {
    stopAll(children);
    process.exit(signal === 'SIGINT' ? 0 : 1);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  backend.on('exit', (code) => {
    if (code !== 0) console.error(`Backend process exited with code ${code}`);
  });

  frontend.on('exit', (code) => {
    if (code !== 0) console.error(`Frontend process exited with code ${code}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
