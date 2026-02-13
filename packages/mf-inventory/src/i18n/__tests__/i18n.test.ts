
import { describe, it, expect } from 'vitest';
import i18n from '../config';

describe('i18n configuration', () => {
    it('should be initialized', () => {
        expect(i18n).toBeDefined();
        expect(i18n.isInitialized).toBe(true);
    });

    it('should translate a key', () => {
        expect(i18n.t('TEST.hello')).toBe('Hola');
    });

    it('should change language', async () => {
        await i18n.changeLanguage('en');
        expect(i18n.t('TEST.hello')).toBe('Hello');
    });
});
