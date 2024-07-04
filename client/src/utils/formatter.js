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
    // Convert the number to a string and use a regular expression to add periods as thousand separators
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(val) {
    const date = new Date(val);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

