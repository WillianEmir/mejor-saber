export const notFound = jest.fn(() => {
  throw new Error('notFound() was called');
});