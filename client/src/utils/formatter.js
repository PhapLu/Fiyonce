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

export function trimString(str, n) {
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