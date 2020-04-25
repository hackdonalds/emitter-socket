import crypto from "crypto"

export const uid = (length:number=6) => crypto.randomBytes(20).toString('hex').slice(0, length);

export const fixCircularReferences = (o:any) => {
    let cache:any = []
    const stringified = JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return JSON.parse(stringified)
}