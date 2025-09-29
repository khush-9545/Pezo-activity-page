# TODO: UI Improvements (Wider Cards, Clean UI, Dynamic Elements)

## Tasks
- [x] Previous responsive updates (Card.css, App.jsx)
- [x] Update App.jsx: Add counts to tabs, dynamic total in $
- [x] Update Card.css: Make cards wider (max-width 400px), clean styles (solid bg, softer shadow, dynamic progress classes)
- [x] Update InProcessOrderCard.jsx: Add dynamic status based on progress, dynamic progress color classes
- [x] Update CompletedOrderCard.jsx: Apply clean styles consistency
- [ ] Test: Run dev server, browser launch, verify layout/counts/colors

## Notes
- Dynamic status: <30% "Preparing" (orange), 30-70% "Printing" (yellow), >70% "Processing" (green)
- Total: Sum prices, use ₹ symbol
- Wider: max-width: 400px, full on mobile
- Clean UI: Solid white bg, reduced shadows, consistent spacing
- 