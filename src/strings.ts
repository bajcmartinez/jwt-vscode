export default {
    warnings: {
        headerBase64Invalid: 'Looks like your JWT header is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
        headerInvalidJSON: 'Looks like your JWT payload is not a valid JSON object. JWT headers must be top level JSON objects as per https://tools.ietf.org/html/rfc7519#section-7.2',
        payloadBase64Invalid: 'Looks like your JWT payload is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
        signatureBase64Invalid: 'Looks like your JWT signature is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
        payloadInvalidJSON: 'Looks like your JWT payload is not a valid JSON object. JWT payloads must be top level JSON objects as per https://tools.ietf.org/html/rfc7519#section-7.2'
    }
}