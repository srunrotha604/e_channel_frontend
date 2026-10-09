import useLoading from '../hooks/useLoading';
describe('test loading hook', () => {
  const { loading, startLoading, stopLoading, setLoading } = useLoading();
  setLoading(() => true);
  expect(loading).toBe(false);
});
