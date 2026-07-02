import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../auth';

describe('auth utilities', () => {
  const password = 's3cr3t';
  let hashed = '';

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  it('hashes and compares password', () => {
    hashed = hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(comparePassword(password, hashed)).toBe(true);
    expect(comparePassword('wrong', hashed)).toBe(false);
  });

  it('generates and verifies token', () => {
    const token = generateToken('user-123');
    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe('user-123');
    expect(verifyToken('invalid.token')).toBeNull();
  });
});
