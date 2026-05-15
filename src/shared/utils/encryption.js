import crypto from 'node:crypto';

const requireEnv = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not set`);
    }

    return value;
};

const ENCRYPTION_KEY = requireEnv('ENCRYPTION_KEY');
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

const getKey = () => {
    const trimmedKey = ENCRYPTION_KEY.trim();

    // Support a raw 32-byte key encoded as 64-char hex.
    if (/^[0-9a-fA-F]{64}$/.test(trimmedKey)) {
        return Buffer.from(trimmedKey, 'hex');
    }

    // Derive a stable 32-byte key from any other key material.
    return crypto.createHash('sha256').update(trimmedKey, 'utf8').digest();
};

export const encryptPassword = (password) => {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

export const decryptPassword = (encryptedPassword) => {
    try {
        const key = getKey();
        const parts = encryptedPassword.split(':');

        if (parts.length !== 3) {
            throw new Error('Invalid encrypted password format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const tag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        throw new Error('Failed to decrypt password: ' + error.message);
    }
};
