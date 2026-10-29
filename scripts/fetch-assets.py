"""Restore licensed rendering assets from pinned revisions and verify every SHA-256."""
import concurrent.futures
import hashlib
import json
import pathlib
import urllib.request
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / 'scripts/asset-downloads.json').read_text())
if '--fonts-only' in sys.argv:
    MANIFEST = [item for item in MANIFEST if '/fonts/' in item['path']]
elif '--2d' in sys.argv:
    MANIFEST = [item for item in MANIFEST if '/models/' not in item['path'] and '/textures/' not in item['path']]

def restore(item):
    destination = ROOT / item['path']
    if destination.is_file() and hashlib.sha256(destination.read_bytes()).hexdigest() == item['sha256']:
        return item['path']
    request = urllib.request.Request(item['url'], headers={'User-Agent': 'Stratum-build/1.3'})
    with urllib.request.urlopen(request, timeout=90) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != item['sha256']:
        raise RuntimeError('Asset hash mismatch: ' + item['path'])
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)
    return item['path']

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for path in pool.map(restore, MANIFEST):
            print('Verified', path)
