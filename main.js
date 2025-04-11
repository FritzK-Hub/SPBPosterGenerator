var pricing_container = document.getElementsByClassName(
  'product-detail-pricing-container'
)[0]

removeElementsByClassName('addon-content')

var addon_content = document.createElement('div')
addon_content.className = 'addon-content'
pricing_container.appendChild(addon_content)

var input = document.createElement('input')
input.type = 'text'
input.placeholder = 'Neuer Preis...'
input.id = 'new-price-input'
addon_content.appendChild(input)

var sale_div = document.createElement('div')
sale_div.id = 'sale-div'
addon_content.appendChild(sale_div)

var radio_sale = document.createElement('input')
radio_sale.id = 'radio-sale'
radio_sale.type = 'radio'
radio_sale.name = 'printType'
radio_sale.checked = true
sale_div.appendChild(radio_sale)

var radio_sale_label = document.createElement('label')
radio_sale_label.setAttribute('for', 'radio-sale')
radio_sale_label.textContent = 'Werbung'
radio_sale_label.style =
  'margin-right: 9rem; padding-left: 0.5rem; font-weight: 500;'
sale_div.appendChild(radio_sale_label)

var regular_div = document.createElement('div')
regular_div.id = 'regular-div'
addon_content.appendChild(regular_div)

var radio_regular = document.createElement('input')
radio_regular.id = 'radio-regular'
radio_regular.type = 'radio'
radio_regular.name = 'printType'
radio_regular.checked = false
regular_div.appendChild(radio_regular)

var radio_regular_label = document.createElement('label')
radio_regular_label.setAttribute('for', 'radio-regular')
radio_regular_label.textContent = 'Normal'
radio_regular_label.style =
  'margin-right: 9rem; padding-left: 0.5rem; font-weight: 500;'
regular_div.appendChild(radio_regular_label)

var bttn = document.createElement('input')
bttn.type = 'button'
bttn.value = 'Drucken'
bttn.id = 'print-button'
bttn.addEventListener('click', e => {
  gatherData()
  createPrintDataElement()
  window.print()
})
addon_content.appendChild(bttn)

// var mainImg = document.getElementsByClassName('d-block m-auto')[0]

// var im = document.createElement('img')
// im.src = mainImg.getAttribute('src')
// im.id = 'product-img-print'
// document.getElementsByTagName('html')[0].appendChild(im)

// var background = document.createElement('img')
// background.src = browser.runtime.getURL('sale_background.png')
// background.id = 'background-img-print'
// document.getElementsByTagName('html')[0].appendChild(background)

var articleNr = document.getElementsByClassName('product-id')[0].textContent

/**
 * Grab data
 */
var listPrice = undefined
var salesPrice = undefined
var mainImgURL = undefined
var backgroundImgURL = undefined
var attributes = undefined
var articleName = undefined
var articleNr = undefined
function gatherData () {
  listPrice = getPrice('list')
  salesPrice = getPrice('sales')
  var newPriceInput = getPriceInput()
  if (!isNaN(newPriceInput)) {
    salesPrice = newPriceInput
  }
  articleName = document.getElementsByClassName('product-title')[0].textContent
  articleNr = document.getElementsByClassName('product-id')[0].textContent
  mainImgURL = document
    .getElementsByClassName('d-block m-auto')[0]
    .getAttribute('src')
  backgroundImgURL = getBackgroundImgURL()
  attributes = document.getElementsByClassName(
    'grid-item product-attributes'
  )[0].innerHTML
}

/**
 * Creates empty div and appends it to
 */
function createPrintDataElement () {
  var elementName = 'print-data-content'
  removeElementsByClassName(elementName)
  var printDataContent = document.createElement('div')
  printDataContent.className = elementName
  printDataContent.appendChild(
    createP('print-data-list-price', floatToPrice(listPrice))
  )
  printDataContent.appendChild(
    createP('print-data-sales-price', floatToPrice(salesPrice))
  )
  printDataContent.appendChild(createP('print-data-uvp', 'UVP'))
  var savedFloat = listPrice - salesPrice
  var savedText =
    (savedFloat < 0.01 ? 'clever' : floatToPrice(savedFloat)) + ' gespart!'
  printDataContent.appendChild(createP('print-data-saved-price', savedText))
  printDataContent.appendChild(createP('print-data-article-name', articleName))
  printDataContent.appendChild(
    createP('print-data-article-nr', 'Art.Nr.: ' + articleNr)
  )
  printDataContent.appendChild(createAttr('print-data-attributes', attributes))
  printDataContent.appendChild(createImg('print-data-main-img', mainImgURL))
  printDataContent.appendChild(
    createImg('print-data-back-img', backgroundImgURL)
  )
  document.getElementsByTagName('html')[0].appendChild(printDataContent)
}

function floatToPrice (n) {
  return n.toFixed(2).replaceAll('.', ',').replaceAll('00', '-')
}

function createP (id, content) {
  var p = document.createElement('p')
  p.id = id
  p.textContent = content
  return p
}

function createImg (id, src) {
  var img = document.createElement('img')
  img.id = id
  img.src = src
  return img
}

function createAttr (id, _innerHTML) {
  var div = document.createElement('div')
  div.id = id
  div.innerHTML = _innerHTML
  return div
}

/**
 *
 * @returns runtime background img url
 */
function getBackgroundImgURL () {
  var fileURL = 'images/sale_background.png'
  if (document.getElementById('radio-regular').checked) {
    fileURL = 'images/regular_background.png'
  }
  fileURL = browser.runtime.getURL(fileURL)
  return fileURL
}

/**
 * Grab price data
 * @param {string} type
 * @returns
 */
function getPrice (type) {
  var int = document.getElementsByClassName(`pricing-${type}__integer`)[0]
    .textContent
  var frac = document.getElementsByClassName(`pricing-${type}__fractional`)[0]
    .textContent
  var price = parseFloat(
    (int + frac).replaceAll(/(\s+)/g, '').replaceAll(',', '.')
  )
  return price
}

/**
 *
 * @returns Input price as float
 */
function getPriceInput () {
  var newPriceInput = document
    .getElementById('new-price-input')
    .value.replaceAll(/(\s+)/g, '')
    .replaceAll('€', '')
    .replaceAll(',', '.')
  return parseFloat(newPriceInput)
}

function removeElementsByClassName (className) {
  var contents = document.getElementsByClassName(className)
  for (const element of contents) {
    element.remove()
  }
}

// let testURL = browser.runtime.getURL('test.txt')

// var testRequest = new Request(testURL)

// window
//   .fetch(testRequest)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(response.status)
//     }

//     return response.blob()
//   })
//   .then(response => {
//     response.text().then(value => {
//       console.log(value)
//     })
//   })
