import { describe, it, expect } from 'vitest';
import * as main from '../main';

describe('Single-SPA Lifecycle', () => {
  it('should export bootstrap, mount, and unmount', () => {
    expect(main.bootstrap).toBeDefined();
    expect(main.mount).toBeDefined();
    expect(main.unmount).toBeDefined();
  });
});
