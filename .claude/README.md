# Claude Code Configuration

This directory contains configuration files for Claude Code.

## Files

- `settings.local.json` - Local Claude Code settings including hooks and permissions
- `play-sound.sh` - Cross-platform script for playing notification sounds
- `CLAUDE.md` - (in parent directory) Codebase guidance for Claude instances

## Cross-Platform Sound Notifications

The `play-sound.sh` script automatically detects your operating system and plays appropriate system sounds:

- **macOS**: Uses the built-in Glass.aiff system sound via `afplay`
- **Windows**: Uses PowerShell to play a system beep
- **Linux**: Uses PulseAudio or ALSA system sounds

No custom sound files are required - the script uses only built-in system sounds.

## Setup

When you clone this repository on a new machine, the sound notifications will work automatically:
- On macOS: Uses system sounds
- On Windows: Uses PowerShell beeps
- No manual configuration needed

The script is called by the Stop hook in `settings.local.json` and will work on any platform.