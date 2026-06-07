#!/usr/bin/env python3
"""Generate audiobook MP3 from audiobook.fr.md via ElevenLabs API."""
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "audiobook.fr.md"
OUT_DIR = ROOT / "audiobook_chunks"
FINAL = ROOT / "audiobook.fr.mp3"

VOICE_ID = "PSVUmed8NvS8aUA3d5oO"
MODEL_ID = "eleven_multilingual_v2"
LANG = "fr"
OUTPUT_FORMAT = "mp3_44100_128"


def load_api_key() -> str:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if key:
        return key
    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY missing")


def clean_markdown(text: str) -> str:
    """Strip markdown for TTS — keep prose only."""
    lines = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            lines.append("")
            continue
        if s.startswith("#"):
            continue  # drop headers (they're spoken in chapter intro)
        if s.startswith("---"):
            continue
        if s.startswith(">"):
            continue  # drop blockquote intro metadata
        # strip bold/italic/code markers
        s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
        s = re.sub(r"\*([^*]+)\*", r"\1", s)
        s = re.sub(r"`([^`]+)`", r"\1", s)
        lines.append(s)
    cleaned = "\n".join(lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned


def split_chapters(md: str) -> list[tuple[str, str]]:
    """Return [(title, body)] per chapter."""
    parts = re.split(r"^## (Chapitre [^\n]+)$", md, flags=re.MULTILINE)
    # parts[0] = preamble, then alternating title, body
    chapters = []
    if parts[0].strip():
        # preamble (intro before first chapter)
        chapters.append(("Introduction", parts[0]))
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        body = parts[i + 1] if i + 1 < len(parts) else ""
        chapters.append((title, body))
    return chapters


def tts_request(api_key: str, text: str, prev_text: str = "", next_text: str = "") -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format={OUTPUT_FORMAT}"
    body = {
        "text": text,
        "model_id": MODEL_ID,
        "language_code": LANG,
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.80,
            "style": 0.10,
            "use_speaker_boost": True,
        },
    }
    if prev_text:
        body["previous_text"] = prev_text
    if next_text:
        body["next_text"] = next_text
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        sys.exit(f"HTTP {e.code}: {body}")


def main():
    api_key = load_api_key()
    md = SRC.read_text(encoding="utf-8")
    raw_chapters = split_chapters(md)
    chapters = [(t, clean_markdown(b)) for t, b in raw_chapters]
    print(f"Chapters: {len(chapters)}")

    OUT_DIR.mkdir(exist_ok=True)
    files = []

    for i, (title, body) in enumerate(chapters):
        body = body.strip()
        if not body:
            continue
        # prepend spoken chapter title for narrative continuity (skip for intro)
        spoken = body if title == "Introduction" else f"{title}. {body}"
        prev_text = chapters[i - 1][1].strip()[-300:] if i > 0 else ""
        next_text = chapters[i + 1][1].strip()[:300] if i + 1 < len(chapters) else ""

        out = OUT_DIR / f"{i:02d}.mp3"
        if out.exists() and out.stat().st_size > 1000:
            print(f"[{i:02d}] {title} — cached ({out.stat().st_size} B)")
            files.append(out)
            continue

        print(f"[{i:02d}] {title} — {len(spoken)} chars … ", end="", flush=True)
        audio = tts_request(api_key, spoken, prev_text=prev_text, next_text=next_text)
        out.write_bytes(audio)
        print(f"{len(audio)} B")
        files.append(out)

    # concat with ffmpeg
    list_file = OUT_DIR / "concat.txt"
    list_file.write_text("\n".join(f"file '{f.name}'" for f in files), encoding="utf-8")
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c", "copy",
        str(FINAL),
    ]
    subprocess.run(cmd, check=True)
    print(f"\nFinal: {FINAL} ({FINAL.stat().st_size} B)")


if __name__ == "__main__":
    main()
