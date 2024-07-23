export function isFilled(val) {
    return val != null && val != undefined && val.trim() !== "";
}

export function minLength(val, length) {
    return val.length >= length;
}

export function maxLength(val, length) {
    return val.length < length;
}

export function isMatch(val1, val2) {
    return val1 === val2;
}

export function minValue(val, min) {
    return val >= min;
}

export function maxValue(val, max) {
    return val <= max;
}

export function hasSymbol(val) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val);
}

export function isValidEmail(val) {
    return /\S+@\S+\.\S+/.test(val);
}

export function isValidPhone(val) {
    // Regex for Vietnamese phone numbers
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

    if (phoneRegex.test(val)) {
        return true;
    } else {
        return false;
    }
}

export function hasDigit(val) {
    return /[0-9]/.test(val);
}

export function isValidPassword(password) {
    return minLength(password, 6) && hasDigit(password) && hasSymbol(password);
}
