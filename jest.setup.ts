import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
  }),
  usePathname: () => '',
}));

// jest.mock('next/image', () => ({
//   __esModule: true,
//   default: (props: any) => <img {...props} />,
// }));
