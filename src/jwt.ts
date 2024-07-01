import strings from './strings'

type DecodeResult = {
    errors: boolean;
    header?: object,
    payload?: object,
    warnings: string[],
}

/**
 * Checks if a given string is a valid Base64 string.
 *
 * @param s - The string to validate.
 * @param allowPadding - If true, allows padding characters ('=') in the Base64 string.
 * @returns True if the string is a valid Base64 string, otherwise false.
 */
function isValidBase64String(s: string, allowPadding = false) {
    // If padding is allowed, use a regex that includes the '=' character
    if (allowPadding) {
        return /^[a-zA-Z0-9_=-]*$/.test(s);
    }

    return /^[a-zA-Z0-9_-]*$/.test(s);
}

/**
 * Checks if a given string is a valid JSON string.
 *
 * @param jsonString - The string to validate.
 * @returns True if the string is a valid JSON string, otherwise false.
 */
function isValidJSON(jsonString: string): boolean {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Decodes a Base64-encoded string.
 *
 * @param input - The Base64-encoded string to decode.
 * @returns The decoded string.
 */
function atob(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = input.replace(/=+$/, '');
    let output = '';

    for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
    }

    return output;
}

/**
 * Decodes a JWT token without verifying its signature.
 *
 * @param token - The JWT token to decode.
 * @returns - A DecodeResult object.
 */
export function decodeJWT(jwt: string): DecodeResult {
    const warnings: string[] = [];

    if (!jwt) {
        return {
            errors: true,
            warnings: warnings,
        }
    }

    const split = jwt.split('.');

    if (!isValidBase64String(split[2])) {
        warnings.push(strings.warnings.signatureBase64Invalid)
    }

    try {
        if (!isValidBase64String(split[0])) warnings.push(strings.warnings.headerBase64Invalid);

        if (!isValidBase64String(split[1])) warnings.push(strings.warnings.payloadBase64Invalid);

        const decodedHeader = atob(split[0])
        const decodedPayload = atob(split[1]);

        if (!isValidJSON(decodedHeader)) warnings.push(strings.warnings.headerInvalidJSON);
        if (!isValidJSON(decodedPayload)) warnings.push(strings.warnings.payloadInvalidJSON);


        const header = JSON.parse(decodedHeader);
        const payload = JSON.parse(decodedPayload)

        return {
            errors: false,
            header: header,
            payload: payload,
            warnings: warnings
        };
    } catch (e) {
        return {
            errors: true,
            warnings: warnings
        }
    }
}