export function formatDate(isoString) {
    // Parse the ISO 8601 string to a Date object
    const date = new Date(isoString);

    // Get day, month, and year
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }); // Short month name
    const year = date.getUTCFullYear();

    // Return the formatted date
    return `${day} ${month} ${year}`;
}