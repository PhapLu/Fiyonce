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

export function isValidPhone(val) {
    const phoneRegex = /^(?:\+?(61))? ?(?:\((0)[1-9]\))? ?(?:[1-9][0-9]{0,3})? ?[0-9]{5,6}?$/;

    if (phoneRegex.test(val)) {
        return true;
    } else {
        return false;
    }
}
