
import { render, screen, act } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';
import { describe, it, expect, afterEach } from 'vitest';

// Component using translation
const TestComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
       <div data-testid="test-div">{t('TEST.hello')}</div>
       <div data-testid="dashboard-title">{t('dashboard.title')}</div>
    </div>
  );
};

describe('Translation Integration', () => {
  afterEach(async () => {
    // Reset to default
    await act(async () => {
      await i18n.changeLanguage('es');
    });
  });

  it('updates text when language changes', async () => {
    // Initial: es
    await act(async () => {
      await i18n.changeLanguage('es');
    });

    render(<TestComponent />);
    expect(screen.getByTestId('test-div')).toHaveTextContent('Hola');
    expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Panel de Control');

    // Change to en
    await act(async () => {
      await i18n.changeLanguage('en');
    });

    expect(screen.getByTestId('test-div')).toHaveTextContent('Hello');
    expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Dashboard');
  });
});
