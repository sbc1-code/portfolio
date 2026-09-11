# Corvus warehouse product illustration

Independent, AI-assisted application sample by Sebastian Becerra. Not commissioned by or affiliated with Corvus Robotics.

Live: https://sbc1-code.github.io/portfolio/corvus-warehouse/

## Purpose
Let a prospective buyer understand autonomous inventory comparison: run a scan, inspect expected versus observed occupancy, and investigate an exception. Twelve fictional locations yield ten matches and two exceptions. A missing expected pallet does not imply the system knows where it went; an unexpected pallet requires review before correcting records.

## Run / handoff
Open index.html in a current browser, or serve this folder as static HTML. No build, third-party JavaScript, backend, keys or tracking. Uses a small Canvas renderer with projected 3D geometry, depth sorting and orbit controls. Logo loads from the official Corvus website. Layout adapts to small screens. Location buttons provide a keyboard-operable alternative to picking objects in the scene. Arrow keys rotate the focused canvas. Reduced-motion preference skips flight animation; Show completed scan always provides the same alternative.

Run autonomous scan / pause / resume; Reset clears all findings. Inspect locations in the scene or the buttons beneath it. Download produces a CSV of checked fictional records only. No inventory or personal data is collected. The scan duration, drone geometry, layout and values are illustrative, not engineering specifications or actual AIMS software. Customer CTA and source links open official Corvus pages.

## Source basis
Reviewed September 10, 2026:
- https://www.corvus-robotics.com/corvus-one
- https://www.corvus-robotics.com/case-study-sgws

## Integration
A production version needs Corvus editorial/brand review, approved product visuals and engineering review of every represented behavior. It can be embedded as a static page/iframe; production analytics and consent would use the host site's approved system. Current sample deliberately has neither.
