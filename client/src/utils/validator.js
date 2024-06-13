export function isFilled(val) {
    return val != null && val != undefined && val.trim() !== "";
}

export function minLength(val, length) {
    return val.length >= length;
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
    return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val);
}

export function isValidEmail(val) {
    return /\S+@\S+\.\S+/.test(val);
}