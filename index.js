const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const screenSize = await page.evaluate(() => {
        return { width: screen.width, height: screen.height };
    });
    await page.setViewport({ width: screenSize.width, height: screenSize.height });
    await page.goto('https://www.monkeytype.com/')
    const modal = await page.waitForSelector('div.modal div.main div.buttons')
    await modal.click('button. active acceptAll')
    const app = await page.waitForSelector('#app main .page.pageTest.full-width.content-grid.active #typingTest #wordsWrapper #words')
    let count = 0
    while (true) {
        try {
            let activeWords = await app.waitForSelector('.word.active', { timeout: '3000' })
            if (!activeWords) {
                break
            }
            const letters = await activeWords.$$eval('letter', (letters) => {
                return letters.map((letter) => letter.textContent);
            });
            const inputElement = await page.waitForSelector('#wordsInput');
            await inputElement.type(`${letters.join('')} `);
            count += 1
            console.log(`Typed Words: ${count}`)
        } catch (error) {
            if (error.name === 'TimeoutError') {
                break
            }
        }
    }
    await page.screenshot({ path: 'result.png' })
    process.exit(0)
})()