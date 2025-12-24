import { test, expect } from '@playwright/test';

const SUPABASE_URL = 'https://fineleshydmsyjcvffye.supabase.co';

test('user can submit comment', async ({ page }) => {
  await page.route(`${SUPABASE_URL}/rest/v1/blog_posts*`, route => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            slug: 'test-slug',
            title_pt: 'Título',
            title_en: 'Title',
            content_pt: '<p>conteúdo</p>',
            content_en: '<p>content</p>',
            published: true,
            author: { name: 'Autor' }
          }
        ]),
        headers: {
          'content-type': 'application/json',
          'content-range': '0-0/1'
        }
      });
    }
  });

  await page.route(`${SUPABASE_URL}/rest/v1/comments*`, route => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
        headers: {
          'content-type': 'application/json',
          'content-range': '0-0/0'
        }
      });
    } else if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        body: JSON.stringify({}),
        headers: {
          'content-type': 'application/json'
        }
      });
    }
  });

  await page.goto('/blog/test-slug');
  await page.fill('input[placeholder="Seu nome"]', 'John');
  await page.fill('input[placeholder="Seu email (opcional)"]', 'john@example.com');
  await page.fill('textarea[placeholder="Seu comentário"]', 'Olá');
  await page.click('button:has-text("Enviar")');
  await expect(page.locator('input[placeholder="Seu nome"]')).toHaveValue('');
});
