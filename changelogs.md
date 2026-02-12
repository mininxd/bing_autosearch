Bing Auto Search Changelog - February 12, 2026

[Core Logic & Performance]
- Removed "Multi-tab Mode" as a configurable option; it is now the permanent default behavior for better performance and reliability.
- Optimized search execution by removing legacy iframe-based search logic.
- Explicitly exposed BING_AUTOSEARCH to the global window object for improved internal logic consistency.

[UI/UX Improvements]
- Modernized the Settings Modal using DaisyUI Collapse components to reduce clutter.
- Added "Search Configuration" section (Open by default) for Limit and Interval settings.
- Grouped Wake Lock and Rewards redirection into a new "Advanced Options" section.
- Moved "Search Categories" into a collapsible container.
- Swapped checkbox positions to the left side for better accessibility and alignment.

[Features]
- Implemented "New Rewards UI" toggle:
  - Enabled: Redirects to /earn upon completion.
  - Disabled (Default): Redirects to /pointsbreakdown upon completion.
- Persistent state management for the new UI toggle via cookies.
- Added "New Rewards UI" status indicator to the active settings badge display.

[Cleanup]
- Removed unused 'div-bing' and iframe related DOM elements.
- Cleaned up obsolete multitab cookie handling and initialization logic.
