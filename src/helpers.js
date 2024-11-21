export const getVideoTitleFromURL = (url) => {
    return url?.split?.("/")?.[4]
}

export const dateConverter = (givenDate, format) => {
    if (!givenDate) {
        return '-'
    }
    const date = new Date(givenDate);

    // Check for invalid date
    if (isNaN(date.getTime())) {
        return '-';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    let formattedDate = '';

    switch (format) {
        case 'YYYY/MM/DD HH:MM AM/PM': {
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format
            formattedDate = `${year}/${month}/${day} ${hours}:${minutes} ${ampm}`;
            break;
        }
        case 'YYYY/MM/DD': {
            formattedDate = `${year}/${month}/${day}`;
            break;
        }
        case 'DD/MM/YYYY': {
            formattedDate = `${day}/${month}/${year}`;
            break;
        }
    }

    return formattedDate;
};