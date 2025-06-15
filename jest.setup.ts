
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    // Add any other router methods your components use
  }),
  usePathname: () => '/', // Default pathname, can be overridden in tests
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock Math.random for consistent snapshot testing if needed
// const mockMath = Object.create(global.Math);
// mockMath.random = () => 0.5;
// global.Math = mockMath;

// If you are using 'next/image' in your tests, you might want to mock it.
// jest.mock('next/image', () => ({
//   __esModule: true,
//   default: (props: any) => {
//     // eslint-disable-next-line @next/next/no-img-element
//     return <img {...props} />;
//   },
// }));
