export function formatDigits(num, len = 2) {
    return `${num}`.padStart(len, '0');
}