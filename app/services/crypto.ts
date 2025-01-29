const CRYPTO_KEY = 'session_encryption';

export const cryptoService = {
  async generateKeys() {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  },

  async encryptSession(data: string) {
    const key = await this.generateKeys();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(data)
    );
    return { iv, encrypted };
  },

  async getSessionToken() {
    const stored = localStorage.getItem(CRYPTO_KEY);
    if (!stored) return null;
    
    try {
      const { iv, encrypted } = JSON.parse(stored);
      const key = await this.generateKeys();
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Session decryption failed');
      return null;
    }
  }
};
