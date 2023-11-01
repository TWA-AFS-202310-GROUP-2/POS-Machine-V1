import { loadAllItems, loadPromotions } from './Dependencies'

export interface Tag {
  barcode: string,
  quantity?: number
}

export interface ReceiptItem {
  name?: string,
  quantity?: Quantity,
  unitPrice?: number,
  subtotal?: number,
  discountedPrice?: number
}

export interface Quantity {
  value: number,
  quantifier: string
}

export function printReceipt(tags: string[]): string {

  const parsedTags = parseTags(tags)

  if (!isValidateItem(parsedTags)) {
    return 'Reject! Input invalid BarCode'
  }

  const receiptItems = generateReceiptItems(parsedTags)

  const receipt = renderReceipt(receiptItems)

  return receipt
}

function parseTags(tags: string[]): Tag[] {
  // const parsedTags: Tag[] = []
  // const alreadyParsed: string[] = []

  // for (const tag of tags) {
  //   const item = tag.split('-')[0]
  //   if (!alreadyParsed.includes(item)) {
  //     parsedTags.push({
  //       barcode: item,
  //       quantity: parseQuantity(item, tags)
  //     })
  //     alreadyParsed.push(item)
  //   }
  // }

  //way 2
  // const parsedTagMap = new Map(tags.map((tag) => [tag.split('-')[0], {
  //   barcode: tag.split('-')[0],
  //   quantity: parseQuantity(tag.split('-')[0], tags)
  // }]))
  // const parsedTags = Array.from(parsedTagMap.values())

  //way 3
  const quantityMap = parseAllQuantity(tags)
  const parsedTagMap = new Map(tags.map((tag) => [tag.split('-')[0], {
    barcode: tag.split('-')[0],
    quantity: quantityMap.get(tag.split('-')[0])
  }]))
  const parsedTags = Array.from(parsedTagMap.values())
  return parsedTags

}

function parseQuantity(keyBarCode: string, tags: string[]) {
  let quantity = 0
  tags.filter((str) => str.includes(keyBarCode))
    .forEach((str) => {
      if (str.includes('-')) {
        quantity += Number(str.split('-')[1])
      } else {
        quantity += 1
      }
    })
  return quantity
}

function parseAllQuantity(tags: string[]): Map<string, number> {
  const quantityMap = new Map<string, number>()
  tags.forEach((str) => {
    const [barcode, quantity] = str.split('-')
    quantityMap.set(barcode, (Number(quantity) || 1) + (quantityMap.get(barcode) || 0))
  })
  return quantityMap
}

function isValidateItem(parsedTags: Tag[]): boolean {
  const allItemsBarCode = loadAllItems().map((item) => item.barcode)
  return parsedTags.find((item) => !allItemsBarCode.includes(item.barcode)) === undefined
}

function generateReceiptItems(tags: Tag[]): ReceiptItem[] {
  const receiptItems: ReceiptItem[] = []
  const items = loadAllItems()

  tags.forEach((tag) => {
    const item = items.find((item) => item.barcode === tag.barcode)
    const receiptItem: ReceiptItem = {
      name: item?.name,
      quantity: {
        value: Number(tag.quantity),
        quantifier: item?.unit + 's'
      },
      unitPrice: item?.price
    }
    const type = hasPromotionOrNot(tag.barcode)
    if (type && type === 'BUY_TWO_GET_ONE_FREE') {
      receiptItem['discountedPrice'] = Math.floor(Number(tag.quantity) / 3) * Number(receiptItem.unitPrice)
      receiptItem['subtotal'] = Number(receiptItem.quantity?.value) * Number(receiptItem.unitPrice) - Number(receiptItem.discountedPrice)
    } else {
      receiptItem['discountedPrice'] = 0
      receiptItem['subtotal'] = Number(receiptItem.quantity?.value) * Number(receiptItem.unitPrice)
    }
    receiptItems.push(receiptItem)
  })
  return receiptItems
}


function hasPromotionOrNot(barCode: string): string | undefined {
  const promotions = loadPromotions()
  return promotions.find((promotion) => promotion.barcodes.includes(barCode))?.type
}


function renderReceipt(receiptItems: ReceiptItem[]): string {

  let total = 0
  let discountedPrices = 0
  const details = receiptItems.map((row) => {
    total += Number(row.subtotal)
    discountedPrices += Number(row.discountedPrice)
    return `Name：${row.name}，Quantity：${row.quantity?.value} ${row.quantity?.quantifier}，Unit：${row.unitPrice?.toFixed(2)}(yuan)，Subtotal：${row.subtotal?.toFixed(2)}(yuan)`
  }).join('\n')

  const res = `***<store earning no money>Receipt ***\n${details}
----------------------
Total：${total.toFixed(2)}(yuan)
Discounted prices：${discountedPrices.toFixed(2)}(yuan)
**********************`
  return res
}
