import { test, expect } from '@playwright/test';

const SUPABASE_URL = 'https://fineleshydmsyjcvffye.supabase.co';

test('admin can create post', async ({ page }) => {
  await page.route(`${SUPABASE_URL}/auth/v1/token*`, route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ access_token: 'token', refresh_token: 'token', token_type: 'bearer', expires_in: 3600, user: { id: '1', email: 'test@example.com' } }),
        headers: { 'content-type': 'application/json' },
      });
    }
  });
  await page.route(`${SUPABASE_URL}/auth/v1/user*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ id: '1', email: 'test@example.com' }),
      headers: { 'content-type': 'application/json' },
    });
  });

  await page.route(`${SUPABASE_URL}/rest/v1/authors*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 'a1', name: 'Author' }]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/categories*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 'c1', title_pt: 'Cat' }]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts*`, route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        body: JSON.stringify([{ id: '1' }]),
        headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
      });
    } else if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
        headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
      });
    }
  });
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts_categories*`, route => {
    route.fulfill({ status: 201, body: JSON.stringify([]), headers: { 'content-type': 'application/json' } });
  });

  await page.goto('/auth');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('/admin');
  await page.goto('/admin/posts/new');
  await page.getByLabel('Title (PT)').fill('Hello World');
  await expect(page.getByLabel('Slug')).toHaveValue('hello-world');
  await page.click('button:has-text("Save")');
  await page.waitForURL('/admin/posts');
});

test('admin can toggle post publish state', async ({ page }) => {
  await page.route(`${SUPABASE_URL}/auth/v1/token*`, route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ access_token: 'token', refresh_token: 'token', token_type: 'bearer', expires_in: 3600, user: { id: '1', email: 'test@example.com' } }),
        headers: { 'content-type': 'application/json' },
      });
    }
  });
  await page.route(`${SUPABASE_URL}/auth/v1/user*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ id: '1', email: 'test@example.com' }),
      headers: { 'content-type': 'application/json' },
    });
  });

  await page.route(`${SUPABASE_URL}/rest/v1/authors*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 'a1', name: 'Author' }]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/categories*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts*`, route => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: '1', author_id: 'a1', slug: 'post-1', title_pt: 'Post 1', content_pt: '', published: false, published_at: null, author: { id: 'a1', name: 'Author' }, categories: [] }]),
        headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
      });
    } else if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: '1', author_id: 'a1', slug: 'post-1', title_pt: 'Post 1', content_pt: '', published: true, published_at: '2024-01-02', author: { id: 'a1', name: 'Author' }, categories: [] }]),
        headers: { 'content-type': 'application/json', 'content-range': '0-0/1' },
      });
    }
  });

  await page.goto('/auth');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('/admin');
  await page.goto('/admin/posts');

  const patchPromise = page.waitForRequest(
    req => req.url().startsWith(`${SUPABASE_URL}/rest/v1/blog_posts`) && req.method() === 'PATCH'
  );

  await expect(page.getByText('Draft')).toBeVisible();
  await page.getByRole('switch').click();
  const patchRequest = await patchPromise;
  const body = JSON.parse(patchRequest.postData() || '{}');
  expect(body.published).toBe(true);
  expect(body.published_at).toBeTruthy();
});
