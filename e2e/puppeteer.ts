import puppeteer from 'puppeteer'
// import { htmlWrapper } from './htmlWrapper'
import 'regenerator-runtime/runtime'

// source ~/.bashrc
;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      // '--disable-gpu',
      // '--disable-extensions',
      '--no-sandbox',
      '--single-process',
      '--disable-setuid-sandbox',
      '--disable-web-security',

      '--enable-automation',
      '--start-maximized',
      `--window-size=${100},${100}`,
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      "--proxy-server='direct://",
      '--proxy-bypass-list=*',
      '--disable-gpu',
      '--disable-accelerated-2d-canvas',
    ],
  })

  const page = await browser.newPage()

  page.on('console', (consoleObj) => console.log(consoleObj.text()))

  await page.goto('http://localhost:1234', { timeout: 1000 })
  await page.waitForTimeout(1000)

  await page.content()

  await page.evaluate(() => {
    document.dispatchEvent(
      new CustomEvent('runOneFrame', { detail: 'boxCollide' }),
    )

    return ''
  })

  await page.screenshot({ path: './example.png' })
  await browser.close()

  console.log('done')
})()
