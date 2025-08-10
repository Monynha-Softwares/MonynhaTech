import { test, expect } from '@playwright/test';

test('renders server error page', async ({ page }) => {
  await page.goto('/500');
  await expect(page.getByText('Erro interno do servidor')).toBeVisible();
});
