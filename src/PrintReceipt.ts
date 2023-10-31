import { loadAllItems, loadPromotions } from './Dependencies'

export interface Tag {
  barcode: string,
  quantity: number
}

export interface ReceiptItem {
  name?: string,
  quantity?: Quantity,
  unitPrice?: string,
  subtotal?: string,
  discountedPrice?: string
}

export interface Quantity {
  value: number,
  quantifier: string
}

export function printReceipt(tags: string[]): string {
  //   return `***<store earning no money>Receipt ***
  // Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
  // Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
  // Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
  // ----------------------
  // Total：58.50(yuan)
  // Discounted prices：7.50(yuan)
  // **********************`

  const parsedTags = parseTags(tags)

  if (!isValidateItem(parsedTags)) {
    return "Reject! Input invalid BarCode"
  }

  const receiptItems = generateReceiptItems(parsedTags)

  const receipt = renderReceipt(receiptItems)

  return receipt
}

function parseTags(tags: string[]): Tag[] {
  const parsedTags: Tag[] = []
  const alreadyParsed: string[] = []

  for (const tag of tags) {
    const item = tag.split('-')[0]
    if (!alreadyParsed.includes(item)) {
      parsedTags.push({
        barcode: item,
        quantity: parseQuantity(item, tags)
      })
      alreadyParsed.push(item)
    }
  }
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

function isValidateItem(parsedTags: Tag[]): boolean {
  const allItemsBarCode = loadAllItems().map((item) => item.barcode)
  return parsedTags.some((item) => allItemsBarCode.includes(item.barcode))
}

function generateReceiptItems(tags: Tag[]): ReceiptItem[] {
  const receiptItems: ReceiptItem[] = []
  const items = loadAllItems()

  tags.forEach((tag) => {
    const item = items.find((item) => item.barcode === tag.barcode)
    const receiptItem: ReceiptItem = {
      name: item?.name,
      quantity: {
        value: tag.quantity,
        quantifier: item?.unit + 's'
      },
      unitPrice: item?.price.toFixed(2)
    }
    const type = hasPromotionOrNot(tag.barcode)
    if (type && type === 'BUY_TWO_GET_ONE_FREE') {
      receiptItem['discountedPrice'] = (Math.floor(tag.quantity / 3) * Number(receiptItem.unitPrice)).toFixed(2)
      receiptItem['subtotal'] = (Number(receiptItem.quantity?.value) * Number(receiptItem.unitPrice) - Number(receiptItem.discountedPrice)).toFixed(2)
    }else{
      receiptItem['discountedPrice'] = '0'
      receiptItem['subtotal'] = (Number(receiptItem.quantity?.value) * Number(receiptItem.unitPrice)).toFixed(2)
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
    return `Name：${row.name}，Quantity：${row.quantity?.value} ${row.quantity?.quantifier}，Unit：${row.unitPrice}(yuan)，Subtotal：${row.subtotal}(yuan)`
  }).join('\n')

  const res = `***<store earning no money>Receipt ***\n${details}
----------------------
Total：${total.toFixed(2)}(yuan)
Discounted prices：${discountedPrices.toFixed(2)}(yuan)
**********************`
  return res
}
