
import { render, act } from '@testing-library/react';
import App from '../App';
import i18n from '../i18n/config';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock RouterProvider and dependencies
vi.mock('@tanstack/react-router', () => ({
  createRouter: () => ({}),
  RouterProvider: () => <div data-testid="router-provider">App Content</div>,
  rootRoute: { addChildren: vi.fn(() => ({})) },
}));

vi.mock('../routes/__root', () => ({ rootRoute: { addChildren: vi.fn() } }));
vi.mock('../routes/index', () => ({ indexRoute: {} }));
vi.mock('../routes/warehouses', () => ({ warehousesRoute: {} }));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}));

describe('Language Integration', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with provided language prop', () => {
        const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');
        // @ts-ignore - Prop doesn't exist yet
        render(<App initialLanguage="en" />);
        expect(changeLanguageSpy).toHaveBeenCalledWith('en');
    });

    it('should respond to language change event', () => {
        const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');
        render(<App />);

        act(() => {
            const event = new CustomEvent('siesa:language:change', { detail: { language: 'fr' } });
            window.dispatchEvent(event);
        });

        expect(changeLanguageSpy).toHaveBeenCalledWith('fr');
    });
});
