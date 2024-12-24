const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')

// FILE -----------------------------------------------------------------------------
// blocking synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `This is what we know about the avovado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written')

//Non blocking asynchronous way
// fs.readFile('./txt/read-this.txt', 'utf8', (error, data) => {
//   console.log(data)
// })
// console.log('READING FILE...')

// SERVER ------------------------------------------------------------------------------

// Loading data and template
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8')
const dataObj = JSON.parse(data)

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf8')
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf8'
)
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf8')

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' })
    const cardHtml = dataObj.map((el) => replaceTemplate(card, el)).join('')
    const output = overview.replace('{%PRODUCT_CARD%}', cardHtml)
    res.end(output)
    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' })
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(card)
    // Not Found
  } else {
    res.writeHead('404', {
      'Content-type': 'text/html',
      'my-own-header': 'Hello World!',
    })
    res.end('<h1>Page Not Found</h1>')
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000')
})
