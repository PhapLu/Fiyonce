import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale'; // Import Vietnamese locale if needed

export const formatEmailToName = (email) => {
    if (!email || typeof email !== 'string') {
        throw new Error('Invalid email address');
    }

    const username = email.split('@')[0];
    return `@${username}`;
};

export function bytesToKilobytes(bytes) {
    const kilobytes = bytes / 1024;
    return kilobytes;
}

export function limitString(str, n) {
    if (!str) {
        return;
    }
    if (str.length <= n) {
        return str;
    }
    return str.substring(0, n) + '...';
}

export function formatFloat(number, n) {
    if (n === 0) {
        return Math.floor(number); // Alternatively, use Math.round(number) if you want to round to the nearest integer
    }
    return number.toFixed(n);
}

export function formatNumber(num, digits) {
    const units = ["", "K", "M", "B", "T"];
    const unitIndex = Math.floor((num.toString().length - 1) / 3);
    const unitValue = num / Math.pow(1000, unitIndex);

    return unitValue.toFixed(digits) + units[unitIndex];
}

export function formatCurrency(val) {
    if (!val) {
        return;
    }
    // Convert the number to a string and use a regular expression to add periods as thousand separators
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(val) {
    const date = new Date(val);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatDatetime(dateString) {
    const date = new Date(dateString);

    // Extract the components
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');

    // Format the date as "HH:MM PM/AM, DD/MM/YYYY"
    return `${formattedHours}:${minutes} ${period}, ${day}/${month}/${year}`;
}

export function formatTimeAgo(date) {
    const distance = formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    return distance.replace('khoảng ', '').replace('dưới ', '').replace('trước', '').trim(); // Remove the "khoảng" prefix
};


export function maskString(str, n) {
    if (str.length <= n) {
        return str;
    }
    const visiblePart = str.slice(0, n);
    const maskedPart = '*'.repeat(str.length - n);
    return visiblePart + maskedPart;
};

export function dateTimeAsYYYYMMDD(date) {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

export function YYYYMMDDAsDDMMYYYY(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

export function camelCaseToCapitalCase(str) {

}

export function createClickableLinks(content) {
    const urlPattern = /(\b(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/gi;
    return content.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function convertToHCMTime(utcDateString) {
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const date = new Date(utcDateString);
    const hcmTime = date.toLocaleString('en-GB', options);

    // Reformat the date to hh:mm dd/mm/yyyy
    const [time, datePart] = hcmTime.split(', ');
    return `${time} ${datePart.replace(/\//g, '/')}`;
}

export const getDaysLeft = (deadline) => {
    if (!deadline) return "-";

    const today = new Date(); // Get today's date
    const deadlineDate = new Date(deadline); // Convert the deadline string to a Date object

    // Calculate the difference in milliseconds
    const timeDifference = deadlineDate - today;

    // Convert the time difference from milliseconds to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Return days left or 'Overdue' if the deadline has passed
    return daysLeft > 0 ? daysLeft : "Overdue";
}
