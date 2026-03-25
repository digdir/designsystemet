import { test, expect } from '@playwright/test';

test('Designsystemet landing page visual test', async ({ page }) => {

    await test.step('navigere til Designsystemet hjemmeside', async () => {
        await page.goto('https://designsystemet.no/no');
    });

    // Wait for things to stabilize (important!)
    await test.step('vente på nettverk', async() => {
        await page.waitForLoadState('networkidle');
    });

    await test.step('klikke på Godta alle og Designsystemet hjemmesiden vises', async() => {
        await page.getByRole('button', { name: 'Bare nødvendige' }).click();
        await expect(page.getByRole('link', { name: 'Designsystem forside' })).toBeVisible();
    });

    await test.step('sammenligne snapshots hjemmeside', async() => {
        await expect(page).toHaveScreenshot('homepage.png');
    });
});

test('Get started page visual test', async ({ page }) => {
    await page.goto('https://designsystemet.no/no');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Bare nødvendige' }).click();
    await page.goto('https://designsystemet.no/no/fundamentals');
    await expect(page.getByRole('heading', { name: 'Kom i gang' })).toBeVisible();

    await expect(page).toHaveScreenshot('get-started.png');
});

test('Komponenter page visual test', async ({ page }) => {
    await page.goto('https://designsystemet.no/no/components');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Bare nødvendige' }).click();
    await expect(page.getByRole('heading', { name: 'Komponenter' })).toBeVisible();

    await expect(page).toHaveScreenshot('komponenter.png');
});

test('Mønster page visual test', async ({ page }) => {
    await page.goto('https://designsystemet.no/no');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Bare nødvendige' }).click();
    await page.goto('https://designsystemet.no/no/patterns');
    await expect(page.getByRole('heading', { name: 'Mønstre', exact: true })).toBeVisible();

    await expect(page).toHaveScreenshot('moenstre.png');
});