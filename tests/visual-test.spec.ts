import { test, expect } from '@playwright/test';

test('homepage visual test', async ({ page }) => {

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