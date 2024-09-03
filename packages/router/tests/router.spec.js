import { Router } from '../src/router';

describe('TrieRouter', () => {
  let router;

  beforeEach(() => {
    router = new Router();
  });

  test('exact match', () => {
    router.add('/users', () => 'Users List');
    const result = router.find('/users');
    expect(result.handler()).toBe('Users List');
  });

  test('parameterized route', () => {
    router.add('/users/:id', (params) => `User ${params.id}`);
    const result = router.find('/users/123');
    expect(result.handler(result.params)).toBe('User 123');
  });

  test('nested parameterized route', () => {
    router.add('/users/:id/posts/:postId', (params) => `User ${params.id}, Post ${params.postId}`);
    const result = router.find('/users/123/posts/456');
    console.log('result', result.params);
    expect(result.handler(result.params)).toBe('User 123, Post 456');
  });

  test('wildcard route', () => {
    router.add('/files/*', (params) => `File path: ${params.wildcard}`);
    const result = router.find('/files/documents/report.pdf');
    expect(result.handler(result.params)).toBe('File path: documents/report.pdf');
  });

  test('no match', () => {
    const result = router.find('/nonexistent');
    expect(result).toBeNull();
  });

  test('overlapping routes', () => {
    router.add('/api/users', () => 'API Users');
    router.add('/api/:resource', (params) => `API ${params.resource}`);

    const resultExact = router.find('/api/users');
    expect(resultExact.handler()).toBe('API Users');

    const resultParam = router.find('/api/posts');
    expect(resultParam.handler(resultParam.params)).toBe('API posts');
  });

  test('root path', () => {
    router.add('/', () => 'Home');
    const result = router.find('/');
    expect(result.handler()).toBe('Home');
  });

  test('multiple parameters', () => {
    router.add('/blog/:year/:month/:day/:slug', (params) => `Blog post: ${params.slug} on ${params.year}-${params.month}-${params.day}`);
    const result = router.find('/blog/2023/08/31/jest-testing');
    expect(result.handler(result.params)).toBe('Blog post: jest-testing on 2023-08-31');
  });

  test('parameter and static parts mixed', () => {
    router.add('/products/:category/sale/:id', (params) => `Sale product: ${params.id} in ${params.category}`);
    const result = router.find('/products/electronics/sale/1234');
    expect(result.handler(result.params)).toBe('Sale product: 1234 in electronics');
  });
});
