import os
import signal
import subprocess
import time
from pathlib import Path

root = Path(__file__).resolve().parent.parent
log_path = root / '.kimi-tmp' / 'preview-server.log'

with log_path.open('w') as log:
    server = subprocess.Popen(
        ['pnpm', 'start', '--port', '3001'],
        cwd=root,
        stdout=log,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )
    try:
        time.sleep(18)
    finally:
        if server.poll() is None:
            os.killpg(server.pid, signal.SIGTERM)
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(server.pid, signal.SIGKILL)
                server.wait(timeout=5)
