"""
api_server.py — Minimal HTTP API for n8n to trigger validation cycles.

Endpoints:
    POST /api/validate     — run a validation cycle for a hypothesis
    POST /api/notify       — receive and log notifications (placeholder)
    GET  /api/health       — health check

Usage:
    python api_server.py                    # default port 8000
    python api_server.py --port 9000        # custom port
"""

from __future__ import annotations

import argparse
import json
import logging
import traceback
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("api_server")

# Import validate_loop lazily to avoid circular imports at module level
_validate_loop = None


def _get_validate_loop():
    global _validate_loop
    if _validate_loop is None:
        import validate_loop as vl
        _validate_loop = vl
    return _validate_loop


class PipelineHandler(BaseHTTPRequestHandler):

    def _send_json(self, status: int, data: dict[str, Any]) -> None:
        body = json.dumps(data, ensure_ascii=False, indent=2).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw)

    # --- GET ---
    def do_GET(self) -> None:
        if self.path == "/api/health":
            self._send_json(200, {"status": "ok", "timestamp": datetime.now().isoformat()})
        else:
            self._send_json(404, {"error": "not found"})

    # --- POST ---
    def do_POST(self) -> None:
        if self.path == "/api/validate":
            self._handle_validate()
        elif self.path == "/api/notify":
            self._handle_notify()
        else:
            self._send_json(404, {"error": "not found"})

    def _handle_validate(self) -> None:
        try:
            body = self._read_body()
            hypothesis_id = body.get("hypothesis_id", "H-006")
            hours = body.get("hours")

            log.info(f"Running validation cycle for {hypothesis_id}")
            vl = _get_validate_loop()
            result = vl.run_cycle(hypothesis_id, hours=hours, verbose=False)
            self._send_json(200, result)

        except KeyError as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:
            log.error(f"Validation failed: {exc}\n{traceback.format_exc()}")
            self._send_json(500, {"error": str(exc)})

    def _handle_notify(self) -> None:
        try:
            body = self._read_body()
            text = body.get("text", "")
            needs_attention = body.get("needs_attention", False)

            log.info(f"Notification received (attention={needs_attention}): {text[:200]}")

            # Log to file for review
            log_dir = BASE_DIR / "data" / "notifications"
            log_dir.mkdir(parents=True, exist_ok=True)
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            log_path = log_dir / f"notify_{ts}.json"
            log_path.write_text(json.dumps(body, ensure_ascii=False, indent=2))

            self._send_json(200, {"received": True, "logged_to": str(log_path)})

        except Exception as exc:
            log.error(f"Notify handler failed: {exc}")
            self._send_json(500, {"error": str(exc)})

    def log_message(self, format, *args):
        log.info(f"{self.client_address[0]} - {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Pipeline API server for n8n integration")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    args = parser.parse_args()

    server = HTTPServer(("0.0.0.0", args.port), PipelineHandler)
    log.info(f"Pipeline API server running on http://0.0.0.0:{args.port}")
    log.info("Endpoints:")
    log.info(f"  POST /api/validate  — run validation cycle")
    log.info(f"  POST /api/notify    — receive notifications")
    log.info(f"  GET  /api/health    — health check")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log.info("Shutting down.")
        server.shutdown()


if __name__ == "__main__":
    main()
