import {loadAllItems, loadPromotions} from './Dependencies'

let items = loadAllItems()
let itemsMap = buildItemsMap(items)
let promotions = loadPromotions()

type Item = {
  barcode: string
  name: string
  unit: string
  price: number
}

type ReceiptItem = {
  item: Item
  quantity: number
  subtotal: number
}
export function printReceipt(tags: string[]): string {
  items = loadAllItems()
  itemsMap = buildItemsMap(items)
  promotions = loadPromotions()
  for (const tag of tags) {
    const error = checkTagFormatValid(tag) || checkTagExist(tag) || checkTagRuleValid(tag)
    if (error) {
      return error
    }
  }
  const receiptMap = arrageTags(tags)
  return buildRecipt(receiptMap)
}

function buildItemsMap(items: Item[]): Map<string, Item> {
  const itemsMap = new Map<string, Item>()
  for (const item of items) {
    itemsMap.set(item.barcode, item)
  }
  return itemsMap
}

function checkTagFormatValid(tag: string): string {
  const tagFormat = /^ITEM\d{6}(-\d+(\.\d{1,2})?)?$/
  if (!tagFormat.test(tag)) {
    return '[ERROR]: invalid format'
  }
  return ''
}

function checkTagExist(tag: string): string {
  const [barcode] = tag.split('-')
  if (!itemsMap.has(barcode)) {
    return '[ERROR]: barcode not found'
  }
  return ''
}

function checkTagRuleValid(tag: string): string {
  const [barcode, quantityStr] = tag.split('-')
  const quantity = quantityStr ? parseFloat(quantityStr) : 1
  if (itemsMap.get(barcode)!.unit !== 'pound' && quantity % 1 !== 0) {
    return '[ERROR]: invalid rule'
  }
  return ''
}

function arrageTags(tags: string[]): Map<string, ReceiptItem> {
  const receiptMap = new Map<string, ReceiptItem>()
  for (const tag of tags) {
    const [barcode, quantityStr] = tag.split('-')
    const quantity = quantityStr ? parseFloat(quantityStr) : 1
    const item = itemsMap.get(barcode)!
    const receiptItem = receiptMap.get(barcode)
    if (receiptItem) {
      receiptItem.quantity += quantity
    } else {
      receiptMap.set(barcode, {item, quantity, subtotal: 0})
    }
  }
  return receiptMap
}

function buildRecipt(tagsMap: Map<string, ReceiptItem>): string {
  const res = computeSubtotalAndTotalDiscount(tagsMap)
  return renderReceipt(res[0], res[1], res[2])
}

function computeSubtotalAndTotalDiscount(receiptMap: Map<string, ReceiptItem>): [Map<string, ReceiptItem>, number, number] {
  let total = 0
  let savings = 0
  for (const [barcode, {item, quantity}] of receiptMap) {
    let subtotal = item.price * quantity
    const promotion = promotions.find(promo => promo.barcodes.includes(barcode))

    if (promotion && promotion.type === 'BUY_TWO_GET_ONE_FREE') {
      subtotal -= Math.floor(quantity / 3) * item.price
      savings += Math.floor(quantity / 3) * item.price
    }
    total += subtotal
    receiptMap.set(barcode, {item, quantity, subtotal})
  }
  return [receiptMap, total, savings]
}

function renderReceipt(receiptMap: Map<string, ReceiptItem>, total: number, savings: number): string {
  let receiptText = '***<store earning no money>Receipt ***\n'
  for (const [, {item, quantity, subtotal}] of receiptMap) {
    receiptText += `Name：${item.name}，Quantity：${quantity} ${item.unit}s，Unit：${item.price.toFixed(2)}(yuan)，Subtotal：${subtotal.toFixed(2)}(yuan)\n`
  }
  receiptText += `----------------------\nTotal：${total.toFixed(2)}(yuan)\nDiscounted prices：${savings.toFixed(2)}(yuan)\n**********************`
  return receiptText
}
