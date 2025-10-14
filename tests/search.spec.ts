import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL must be defined for Playwright tests.');
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('lang', 'en');
  });
});

test('search page shows results with correct type', async ({ page }) => {
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          id: '1',
          title_pt: 'Post 1',
          content_pt: '',
          slug: 'post-1',
          published: true,
          published_at: '2024-01-01',
          author: { name: 'Author' },
          categories: [],
        },
      ]),
      headers: {
        'content-type': 'application/json',
        'content-range': '0-0/1',
      },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/projects*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/docs*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });

  await page.goto('/search?q=post');
  await expect(page.getByText('Post 1')).toBeVisible();
  await expect(page.getByText('Blog').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Post 1' })).toHaveAttribute('href', '/blog/post-1');
});

test('clicking suggestion navigates to result page', async ({ page }) => {
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts*`, route => {
    const url = route.request().url();
    if (url.includes('slug=eq.post-1')) {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            title_pt: 'Post 1',
            content_pt: '',
            slug: 'post-1',
            published: true,
            author: { name: 'Author' },
          },
        ]),
        headers: {
          'content-type': 'application/json',
          'content-range': '0-0/1',
        },
      });
    } else {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            title_pt: 'Post 1',
            content_pt: '',
            slug: 'post-1',
            published: true,
            published_at: '2024-01-01',
            author: { name: 'Author' },
            categories: [],
          },
        ]),
        headers: {
          'content-type': 'application/json',
          'content-range': '0-0/1',
        },
      });
    }
  });
  await page.route(`${SUPABASE_URL}/rest/v1/projects*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/docs*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/comments*`, route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { 'content-type': 'application/json', 'content-range': '0-0/0' },
    });
  });

  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Search the site' });
  await input.fill('post');

  const option = page.getByRole('option').first();
  await expect(option).toContainText('Post 1');
  await option.click();
  await page.waitForURL('/blog/post-1');
});
