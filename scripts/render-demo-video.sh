#!/usr/bin/env bash
set -euo pipefail

FONT='/System/Library/Fonts/Supplemental/Verdana.ttf'
OUT='outputs/video'
mkdir -p "$OUT"

ffmpeg -y -loop 1 -t 15 -i outputs/choice-atlas-hero.png -vf "scale=1920:1080,drawbox=x=0:y=0:w=1920:h=1080:color=0x1e2a27@0.16:t=fill,drawtext=fontfile=${FONT}:text='A decision changes more than one life':fontcolor=white:fontsize=52:x=120:y=875:box=1:boxcolor=0x1e2a27@0.72:boxborderw=24,drawtext=fontfile=${FONT}:text='CHOICE ATLAS  /  A FIELD GUIDE FOR UNCERTAINTY':fontcolor=0xe5d3a0:fontsize=24:x=120:y=965,fade=t=in:st=0:d=0.5,fade=t=out:st=14.4:d=0.6" -r 30 -an "$OUT/01-hero.mp4"

ffmpeg -y -loop 1 -t 20 -i outputs/choice-atlas-demo-first-intake.png -vf "crop=1265:712:0:1080,scale=1920:1080,drawbox=x=0:y=0:w=1920:h=1080:color=0x1e2a27@0.10:t=fill,drawtext=fontfile=${FONT}:text='START WITH TWO ROUTES':fontcolor=0xe5d3a0:fontsize=28:x=110:y=102,drawtext=fontfile=${FONT}:text='Quick start — then make the fork your own':fontcolor=white:fontsize=43:x=110:y=925:box=1:boxcolor=0x1e2a27@0.74:boxborderw=20,fade=t=in:st=0:d=0.35,fade=t=out:st=19.5:d=0.5" -r 30 -an "$OUT/02-intake.mp4"

ffmpeg -y -loop 1 -t 15 -i outputs/choice-atlas-live-map.png -vf "scale=1920:1080,drawbox=x=0:y=0:w=1920:h=1080:color=0x1e2a27@0.12:t=fill,drawtext=fontfile=${FONT}:text='LIVE GPT-5.6 MAP':fontcolor=0xe5d3a0:fontsize=28:x=110:y=102,drawtext=fontfile=${FONT}:text='Known ground. Assumptions. Unknowns.':fontcolor=white:fontsize=43:x=110:y=925:box=1:boxcolor=0x1e2a27@0.74:boxborderw=20,fade=t=in:st=0:d=0.35,fade=t=out:st=14.5:d=0.5" -r 30 -an "$OUT/03-live-proof.mp4"

ffmpeg -y -loop 1 -t 22 -i outputs/choice-atlas-decision-weather-detail.png -vf "scale=1920:1080,drawbox=x=0:y=0:w=1920:h=1080:color=0x1e2a27@0.10:t=fill,drawtext=fontfile=${FONT}:text='VISUAL FIRST READING':fontcolor=0xe5d3a0:fontsize=28:x=110:y=102,drawtext=fontfile=${FONT}:text='The map shows the pull — not the answer':fontcolor=white:fontsize=43:x=110:y=925:box=1:boxcolor=0x1e2a27@0.74:boxborderw=20,fade=t=in:st=0:d=0.35,fade=t=out:st=21.5:d=0.5" -r 30 -an "$OUT/04-weather.mp4"

ffmpeg -y -loop 1 -t 23 -i outputs/choice-atlas-architecture.png -vf "scale=1920:1080,drawtext=fontfile=${FONT}:text='THE LIVE HANDSHAKE':fontcolor=0xe5d3a0:fontsize=28:x=110:y=102:box=1:boxcolor=0x1e2a27@0.50:boxborderw=12,fade=t=in:st=0:d=0.35,fade=t=out:st=22.5:d=0.5" -r 30 -an "$OUT/05-architecture.mp4"

ffmpeg -y -loop 1 -t 20 -i outputs/choice-atlas-proof.png -vf "scale=1920:1080,fade=t=in:st=0:d=0.35,fade=t=out:st=19.5:d=0.5" -r 30 -an "$OUT/06-proof.mp4"

ffmpeg -y -loop 1 -t 8 -i outputs/choice-atlas-hero.png -vf "scale=1920:1080,drawbox=x=0:y=0:w=1920:h=1080:color=0x1e2a27@0.42:t=fill,drawtext=fontfile=${FONT}:text='CHOICE ATLAS':fontcolor=white:fontsize=78:x=(w-text_w)/2:y=455,drawtext=fontfile=${FONT}:text='A better map for the decision you still own':fontcolor=0xe5d3a0:fontsize=32:x=(w-text_w)/2:y=540,fade=t=in:st=0:d=0.4,fade=t=out:st=7.4:d=0.6" -r 30 -an "$OUT/07-close.mp4"

ffmpeg -y -i "$OUT/01-hero.mp4" -i "$OUT/02-intake.mp4" -i "$OUT/03-live-proof.mp4" -i "$OUT/04-weather.mp4" -i "$OUT/05-architecture.mp4" -i "$OUT/06-proof.mp4" -i "$OUT/07-close.mp4" -i outputs/choice-atlas-voiceover.aiff -filter_complex "[0:v]setsar=1[v0];[1:v]setsar=1[v1];[2:v]setsar=1[v2];[3:v]setsar=1[v3];[4:v]setsar=1[v4];[5:v]setsar=1[v5];[6:v]setsar=1[v6];[v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0[v];[7:a]loudnorm=I=-16:LRA=11:TP=-1.5[a]" -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -t 123 "$OUT/choice-atlas-build-week-demo-1080p.mp4"

ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 "$OUT/choice-atlas-build-week-demo-1080p.mp4"
