feat: offline mode and export functionality for appointments

- Added React Query persistence with offline cache for /admin pages
- Added OfflineIndicator component to show connection status and last cached data
- Added AppointmentExportDialog to download appointments by day or week as CSV
- Added useOnlineStatus hook for connection tracking
- Updated layout to include offline indicator
- Updated appointment management to handle offline state and export dialog
- Added proper type safety and error handling throughout
- Added build artifacts and updated scripts