export function error(message: string): never {
    throw new Error(message);
}

export function check<T>(x: T | null | undefined) {
    return x || error('Undefined or null value');
}