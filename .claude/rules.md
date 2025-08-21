# Claude Code Rules

## Version Number System
- Always increment the version number in the search placeholder when making changes
- Format: `placeholder="Search the web... vX"` where X is the next sequential number
- This helps track if the live site has been updated

## Deployment Process
- After making changes, always update version number
- Commit with format: `vX: brief description of changes`
- Push to GitHub Pages automatically

## Layout Guidelines
- Maintain the tiling window manager style grid layout
- Keep the gradient welcome message styling
- Preserve glassmorphism transparency effects
- Ensure proper card positioning in grid

## Font and Typography
- Use Inter font family for better readability
- Maintain larger font sizes for accessibility
- Keep consistent spacing and padding

## Testing
- Test layout changes incrementally
- Use version numbers to verify updates are live
- Check responsive behavior across screen sizes