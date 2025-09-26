#!/bin/bash

# Claude Hooks TypeScript Checker
# Intelligent post-edit type checking with three modes of operation
# Usage: Set TYPECHECK_MODE env var to control output style

set -euo pipefail

# Determine project root and config location
PROJECT_ROOT="/Users/ryanhunter/git_forks/tanstack-effect-cloudflare-template"
CONFIG_FILE="$PROJECT_ROOT/.claude/hooks/config.env"

# Store env override if provided
ENV_MODE="${TYPECHECK_MODE:-}"

# Source config if it exists (only if no env override)
if [ -f "$CONFIG_FILE" ] && [ -z "$ENV_MODE" ]; then
    set -a  # automatically export all variables
    source "$CONFIG_FILE"
    set +a
fi

# Configuration with fallback (prefer env override)
TYPECHECK_MODE="${ENV_MODE:-${TYPECHECK_MODE:-balanced}}"  # options: simple, balanced, advanced
CACHE_FILE="/tmp/claude-typecheck-$(basename "$PWD").txt"

# Ensure we're in the right directory
cd "$PROJECT_ROOT"

# Read stdin JSON to get edited file path for contextual focus
INPUT_JSON=$(cat)
EDITED_FILE=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // .tool_response.filePath // ""' 2>/dev/null || echo "")

# Only run on TypeScript/TSX files - EXIT IMMEDIATELY for other file types
if [ -n "$EDITED_FILE" ] && ! echo "$EDITED_FILE" | grep -qE '\.(ts|tsx)$'; then
    # Silent exit for non-TS files - no output to avoid pause
    exit 0
fi

EDITED_DIR=""
if [ -n "$EDITED_FILE" ]; then
    EDITED_DIR=$(dirname "$EDITED_FILE" 2>/dev/null || echo "")
fi

# Find the nearest package.json to run check from there
PACKAGE_DIR=""
if [ -n "$EDITED_FILE" ]; then
    # Start from the edited file's directory and walk up to find package.json
    CHECK_DIR=$(dirname "$EDITED_FILE")
    while [ "$CHECK_DIR" != "/" ]; do
        if [ -f "$CHECK_DIR/package.json" ]; then
            PACKAGE_DIR="$CHECK_DIR"
            break
        fi
        CHECK_DIR=$(dirname "$CHECK_DIR")
    done
fi

# If no package.json found or no edited file, fall back to project root
if [ -z "$PACKAGE_DIR" ]; then
    PACKAGE_DIR="$PROJECT_ROOT"
fi

# Run type check and capture output with timing
# Use pnpm check which properly handles pretty output even when piped
if command -v gdate >/dev/null 2>&1; then
    # Use GNU date if available (macOS with coreutils)
    START_TIME=$(gdate +%s%3N)
    # Run pnpm check from the package directory for faster, scoped checking
    OUTPUT=$(cd "$PACKAGE_DIR" && pnpm check 2>&1 || true)
    END_TIME=$(gdate +%s%3N)
    ELAPSED_MS=$((END_TIME - START_TIME))
else
    # Fallback to seconds precision
    START_TIME=$(date +%s)
    # Run pnpm check from the package directory for faster, scoped checking
    OUTPUT=$(cd "$PACKAGE_DIR" && pnpm check 2>&1 || true)
    END_TIME=$(date +%s)
    ELAPSED_MS=$(((END_TIME - START_TIME) * 1000))
fi

# Strip ANSI color codes and count errors
CLEAN_OUTPUT=$(echo "$OUTPUT" | sed 's/\x1B\[[0-9;]*[JKmsu]//g')
ERROR_COUNT=$(echo "$CLEAN_OUTPUT" | grep -c "error TS" || true)
# Fix potential issue with empty count
[ -z "$ERROR_COUNT" ] && ERROR_COUNT=0

# Debug removed

# Path normalization - handle both absolute and relative paths
normalize_path() {
    local path="$1"
    # Strip project root prefix if present
    path=$(echo "$path" | sed 's|^'"$PROJECT_ROOT"'/||')
    # Strip leading slash if present
    path=$(echo "$path" | sed 's|^/||')

    # If path doesn't start with packages/, we need to figure out which package it belongs to
    if ! echo "$path" | grep -q "^packages/"; then
        # If we have a PACKAGE_DIR, use it to determine the package name
        if [ -n "$PACKAGE_DIR" ]; then
            # Extract package name from PACKAGE_DIR
            local package_relative=$(echo "$PACKAGE_DIR" | sed 's|^'"$PROJECT_ROOT"'/||')
            # If it starts with src/ or another local path, prepend the package path
            if echo "$path" | grep -q "^src/" || ! echo "$path" | grep -q "/"; then
                path="$package_relative/$path"
            fi
        fi
    fi

    echo "$path"
}

# Parse TypeScript error into components: path|line|col|code|message
parse_error() {
    local line="$1"
    # Handle --pretty format: file:line:col - error TSxxx: message
    if echo "$line" | grep -qE '^\S+:[0-9]+:[0-9]+ - error TS[0-9]+:'; then
        echo "$line" | sed -E 's/^([^:]+):([0-9]+):([0-9]+) - error (TS[0-9]+): (.*)$/\1|\2|\3|\4|\5/'
    # Handle regular format: file(line,col): error TSxxx: message
    elif echo "$line" | grep -qE '^\S+\([0-9]+,[0-9]+\): error TS[0-9]+:'; then
        echo "$line" | sed -E 's/^([^(]+)\(([0-9]+),([0-9]+)\): error (TS[0-9]+): (.*)$/\1|\2|\3|\4|\5/'
    fi
}

# Get errors for the edited file with full details
get_edited_file_errors() {
    if [ -z "$EDITED_FILE" ]; then
        return
    fi
    
    local normalized_edited=$(normalize_path "$EDITED_FILE")
    
    # Return matching errors to stdout (not stderr)
    echo "$CLEAN_OUTPUT" | grep "error TS" | while IFS= read -r line; do
        local parsed=$(parse_error "$line")
        if [ -n "$parsed" ]; then
            local file_path=$(echo "$parsed" | cut -d'|' -f1)
            local normalized_current=$(normalize_path "$file_path")
            if [ "$normalized_current" = "$normalized_edited" ]; then
                echo "$line"  # Return the full original error line
            fi
        fi
    done
}

# Get parsed errors for the edited file (for structured JSON)
get_edited_file_errors_parsed() {
    if [ -z "$EDITED_FILE" ]; then
        return
    fi
    
    local normalized_edited=$(normalize_path "$EDITED_FILE")
    echo "$CLEAN_OUTPUT" | grep "error TS" | while IFS= read -r line; do
        local parsed=$(parse_error "$line")
        if [ -n "$parsed" ]; then
            local file_path=$(echo "$parsed" | cut -d'|' -f1)
            local normalized_current=$(normalize_path "$file_path")
            if [ "$normalized_current" = "$normalized_edited" ]; then
                echo "$parsed"
            fi
        fi
    done
}

# Get directory errors (same directory as edited file) with full details
get_directory_errors() {
    if [ -z "$EDITED_FILE" ] || [ -z "$EDITED_DIR" ]; then
        return
    fi
    
    local normalized_edited=$(normalize_path "$EDITED_FILE")
    local normalized_dir=$(normalize_path "$EDITED_DIR")
    
    # Get full error lines for same directory files, exclude the edited file itself
    echo "$CLEAN_OUTPUT" | grep "error TS" | while IFS= read -r line; do
        local parsed=$(parse_error "$line")
        if [ -n "$parsed" ]; then
            local file_path=$(echo "$parsed" | cut -d'|' -f1)
            local normalized_current=$(normalize_path "$file_path")
            local current_dir=$(dirname "$normalized_current")
            
            # Same directory but not the edited file
            if [ "$current_dir" = "$normalized_dir" ] && [ "$normalized_current" != "$normalized_edited" ]; then
                echo "$line"  # Return full original error line
            fi
        fi
    done | sort
}

# Get other file errors with counts and types
get_other_errors_count() {
    local normalized_dir=""
    if [ -n "$EDITED_DIR" ]; then
        normalized_dir=$(normalize_path "$EDITED_DIR")
    fi
    
    # Group errors by file for files outside the edited directory
    echo "$CLEAN_OUTPUT" | grep "error TS" | while IFS= read -r line; do
        local parsed=$(parse_error "$line")
        if [ -n "$parsed" ]; then
            local file_path=$(echo "$parsed" | cut -d'|' -f1)
            local normalized_current=$(normalize_path "$file_path")
            local current_dir=$(dirname "$normalized_current")
            
            # Different directory or no edited file context
            if [ -z "$normalized_dir" ] || [ "$current_dir" != "$normalized_dir" ]; then
                local error_code=$(echo "$parsed" | cut -d'|' -f4)
                echo "$normalized_current|$error_code"
            fi
        fi
    done | sort
}

# Function: Simple mode - just count
simple_mode() {
    if [ "$ERROR_COUNT" -eq 0 ]; then
        echo "✅ TypeScript: All clean!"
    else
        echo "⚠️  TypeScript: $ERROR_COUNT type errors detected"
    fi
}

# Function: Balanced mode - show first few errors with code excerpts
balanced_mode() {
    if [ "$ERROR_COUNT" -eq 0 ]; then
        echo "✅ TypeScript: All clean! (checked $(basename "$PACKAGE_DIR"))"
        return 0
    fi

    echo "🔴 TypeScript: $ERROR_COUNT type errors detected in $(basename "$PACKAGE_DIR")"
    echo ""
    
    # Show first 2 full errors with code excerpts
    # --pretty output includes multiple lines per error with code context
    # We need to capture from error line to the next error or EOF
    local shown=0
    local in_error=false
    local error_buffer=""
    
    while IFS= read -r line; do
        if echo "$line" | grep -q "error TS"; then
            # Found an error line
            if [ "$in_error" = true ] && [ -n "$error_buffer" ]; then
                # Output previous error
                echo "$error_buffer"
                echo ""
                shown=$((shown + 1))
                if [ "$shown" -ge 2 ]; then
                    break
                fi
            fi
            error_buffer="$line"
            in_error=true
        elif [ "$in_error" = true ]; then
            # Accumulate lines that belong to current error (code excerpt + squiggles)
            if [ -n "$line" ] || echo "$error_buffer" | grep -q "^[[:space:]]"; then
                error_buffer="$error_buffer"$'\n'"$line"
            fi
        fi
    done <<< "$CLEAN_OUTPUT"
    
    # Output last error if we haven't shown enough
    if [ "$in_error" = true ] && [ "$shown" -lt 2 ] && [ -n "$error_buffer" ]; then
        echo "$error_buffer"
        echo ""
        shown=$((shown + 1))
    fi
    
    if [ "$ERROR_COUNT" -gt 2 ]; then
        echo "... and $((ERROR_COUNT - 2)) more errors"
    fi
}

# Function: Advanced mode - diff tracking with context
advanced_mode() {
    if [ "$ERROR_COUNT" -eq 0 ]; then
        echo "✅ TypeScript: All clean!"
        rm -f "$CACHE_FILE"
        return 0
    fi

    # Compare with previous run if cache exists
    if [ -f "$CACHE_FILE" ]; then
        PREV_COUNT=$(grep -c "error TS" "$CACHE_FILE" 2>/dev/null || echo 0)
        
        if [ "$ERROR_COUNT" -gt "$PREV_COUNT" ]; then
            echo "🔴 TypeScript: $ERROR_COUNT errors (+$((ERROR_COUNT - PREV_COUNT)) new)"
        elif [ "$ERROR_COUNT" -lt "$PREV_COUNT" ]; then
            echo "🟡 TypeScript: $ERROR_COUNT errors (-$((PREV_COUNT - ERROR_COUNT)) fixed)"
        else
            echo "🟡 TypeScript: $ERROR_COUNT errors (unchanged)"
        fi
        
        # Show new errors if any
        if [ "$ERROR_COUNT" -gt "$PREV_COUNT" ]; then
            echo ""
            echo "🆕 New errors:"
            comm -13 <(grep "error TS" "$CACHE_FILE" 2>/dev/null | sort) <(echo "$CLEAN_OUTPUT" | grep "error TS" | sort) | head -3 || true
        fi
    else
        echo "🔴 TypeScript: $ERROR_COUNT errors detected"
    fi

    # Always show top 3 errors for context
    echo ""
    echo "📋 Top errors:"
    echo "$CLEAN_OUTPUT" | grep "error TS" | head -3 || true
    
    if [ "$ERROR_COUNT" -gt 3 ]; then
        echo "... and $((ERROR_COUNT - 3)) more errors"
    fi

    # Cache current output
    echo "$CLEAN_OUTPUT" > "$CACHE_FILE"
}

# Function: Show debug info
debug_mode() {
    echo "🔧 Debug Info:"
    echo "  Mode: $TYPECHECK_MODE"
    echo "  Project: $PROJECT_ROOT"
    echo "  Cache: $CACHE_FILE"
    echo "  Error Count: $ERROR_COUNT"
    echo ""
}

# Skip mode execution here - handle it in the error/success blocks below

# Output user-friendly format to stdout for transcript
if [ "$ERROR_COUNT" -gt 0 ]; then
    case "$TYPECHECK_MODE" in
        "simple") simple_mode ;;
        "balanced") balanced_mode ;;
        "advanced") advanced_mode ;;
        "debug") debug_mode; balanced_mode ;;
        *) balanced_mode ;;
    esac
else
    echo "✅ TypeScript check passed in ${ELAPSED_MS}ms (package: $(basename "$PACKAGE_DIR"))"
fi

# ALWAYS output JSON to stderr for Claude with contextual errors
if [ "$ERROR_COUNT" -gt 0 ]; then
    # Start JSON output
    {
        echo '{'
        echo '  "decision": "allow",'
        echo '  "reason": "TypeScript errors detected",'
        echo '  "hookSpecificOutput": {'
        echo '    "errorCount": '"$ERROR_COUNT"','
        echo '    "executionTimeMs": '"$ELAPSED_MS"','
        
        # Add edited file errors
        echo '    "editedFileErrors": ['
        EDITED_ERRORS=$(get_edited_file_errors || true)
        if [ -n "$EDITED_ERRORS" ]; then
            COUNT=0
            # Just output the error lines cleanly
            echo "$EDITED_ERRORS" | head -3 | while IFS= read -r error_line; do
                if [ -n "$error_line" ]; then
                    # Escape for JSON
                    ESCAPED=$(echo "$error_line" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
                    if [ $COUNT -gt 0 ]; then
                        echo ','
                    fi
                    echo -n '      "'"$ESCAPED"'"'
                    COUNT=$((COUNT + 1))
                fi
            done || true
            echo ''
        fi
        echo '    ],'
        
        # Add directory errors summary
        echo '    "directoryErrors": ['
        DIR_ERRORS=$(get_directory_errors || true)
        if [ -n "$DIR_ERRORS" ]; then
            COUNT=0
            echo "$DIR_ERRORS" | head -2 | while IFS= read -r line; do
                if [ -n "$line" ]; then
                    ESCAPED=$(echo "$line" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
                    if [ $COUNT -gt 0 ]; then
                        echo ','
                    fi
                    echo -n '      "'"$ESCAPED"'"'
                    COUNT=$((COUNT + 1))
                fi
            done || true
            echo ''
        fi
        echo '    ],'
        
        # Add all files error counts (unified view)
        echo '    "allFileCounts": {'
        # Get all errors and group by file
        ALL_ERRORS=$(echo "$CLEAN_OUTPUT" | grep "error TS" || true)
        if [ -n "$ALL_ERRORS" ]; then
            COUNT=0
            # Parse each error and extract file path
            echo "$ALL_ERRORS" | while IFS= read -r line; do
                parsed=$(parse_error "$line")
                if [ -n "$parsed" ]; then
                    file_path=$(echo "$parsed" | cut -d'|' -f1)
                    normalized=$(normalize_path "$file_path")
                    echo "$normalized"
                fi
            done | sort | uniq -c | while read -r count filepath; do
                if [ -n "$filepath" ]; then
                    if [ $COUNT -gt 0 ]; then
                        echo ','
                    fi
                    echo -n '      "'"$filepath"'": '"$count"
                    COUNT=$((COUNT + 1))
                fi
            done || true
            echo ''
        fi
        echo '    }'
        echo '  }'
        echo '}'
    } >&2
else
    echo '{"decision":"allow","reason":"TypeScript check passed","hookSpecificOutput":{"errorCount":0,"executionTimeMs":'"$ELAPSED_MS"'}}' >&2
fi

# ALWAYS exit with code 2 to ensure Claude sees stderr
exit 2