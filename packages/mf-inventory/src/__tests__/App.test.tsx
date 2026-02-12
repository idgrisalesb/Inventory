import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

describe('App Component', () => {
  it('renders without crashing', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(await screen.findByRole('heading', { name: /Inventory Module/i })).toBeInTheDocument();
  });

  it('shows "No Token" when unauthenticated', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(await screen.findByText(/No Token/i)).toBeInTheDocument();
  });

  it('shows "Authenticated" when token is provided', async () => {
    render(
      <AuthProvider initialToken="fake-jwt-token">
        <App />
      </AuthProvider>
    );
    expect(await screen.findByText(/Authenticated/i)).toBeInTheDocument();
  });
});
