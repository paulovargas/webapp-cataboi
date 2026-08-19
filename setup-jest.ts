import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'jest-canvas-mock';

setupZoneTestEnv();

class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});
