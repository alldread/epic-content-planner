#!/bin/bash

# Cross-platform sound notification script for Claude Code
# Works on both macOS and Windows (Git Bash/WSL)

# Detect the operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - Use system alert sound
    # Try multiple methods to ensure it works
    if command -v afplay &> /dev/null; then
        # Play the system Glass sound (built-in macOS sound)
        afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || \
        afplay /System/Library/Sounds/Ping.aiff 2>/dev/null || \
        osascript -e 'beep' 2>/dev/null || \
        printf '\a'
    elif command -v osascript &> /dev/null; then
        # Fallback to AppleScript beep
        osascript -e 'beep'
    else
        # Last resort - terminal bell
        printf '\a'
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows - Use PowerShell for system sound
    if command -v powershell.exe &> /dev/null; then
        # Use Windows system beep
        powershell.exe -c "[console]::beep(800,200)" 2>/dev/null || \
        powershell.exe -c "[System.Media.SystemSounds]::Beep.Play()" 2>/dev/null || \
        cmd.exe /c "echo ^G" 2>/dev/null
    elif command -v cmd.exe &> /dev/null; then
        # Fallback to command prompt beep
        cmd.exe /c "echo ^G"
    else
        # Terminal bell as last resort
        printf '\a'
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - Try various methods
    if command -v paplay &> /dev/null; then
        # PulseAudio sound
        paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null || \
        paplay /usr/share/sounds/freedesktop/stereo/bell.oga 2>/dev/null || \
        printf '\a'
    elif command -v aplay &> /dev/null; then
        # ALSA sound
        aplay /usr/share/sounds/alsa/Front_Center.wav 2>/dev/null || \
        printf '\a'
    elif command -v speaker-test &> /dev/null; then
        # Quick speaker test beep
        timeout 0.2 speaker-test -t sine -f 800 &> /dev/null || \
        printf '\a'
    else
        # Terminal bell
        printf '\a'
    fi
else
    # Unknown OS - use terminal bell
    printf '\a'
fi

# Exit successfully regardless of which method was used
exit 0