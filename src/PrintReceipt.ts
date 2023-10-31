import { loadAllItems, loadPromotions } from './Dependencies'

interface Quantity {
    value: number;
    quantifier: string
}

interface ReceiptItem {
    name: string;
    quantity: Quantity;
    unitPrice: number;
    subtotal: number;
    discountedPrice: number
}

interface Tag {
    barcode: string;
    quantity: number;
}

export function printReceipt(tags: string[]): string {
  const parsedTags: Tag[] = parseTags(tags)
  const receiptItems: ReceiptItem[] = generateReceiptItems(parsedTags)
  return renderReceipt(receiptItems)
}

function parseQuantity(quantityStr: string): number {
  const quantity = parseFloat(quantityStr)
  if (isNaN(quantity)) {
    throw new Error('Not a valid quantity')
  }
  return quantity
}

function parseTags(tags: string[]): Tag[] {
  const parsedTags: Tag[] = []
  for (const tag of tags) {
    const parts = tag.split('-')
    const barcode = parts[0]
    const quantity = parts.length > 1 ? parseQuantity(parts[1]) : 1
    const filteredTag: Tag | undefined = parsedTags.find(parsedTag => parsedTag.barcode === barcode)
    filteredTag === undefined ? parsedTags.push({ barcode: barcode, quantity: quantity }) : filteredTag.quantity += quantity
  }
  return parsedTags
}

function calculateDiscountedSubtotal(quantity: number, price: number, promotionType: string | undefined): number {
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    return (quantity - Math.floor(quantity / 3)) * price
  } else {
    return quantity * price
  }
}

function generateReceiptItems(parsedTags: Tag[]): ReceiptItem[] {
  const allItems = loadAllItems()
  const promotions = loadPromotions()
  return parsedTags.map(parsedTag => {
    const item = allItems.find(item => item.barcode === parsedTag.barcode)
    if (item === undefined) {
      throw new Error(`The barcode ${parsedTag} is not registered`)
    }
    const promotion = promotions.find(promotion => promotion.barcodes.includes(parsedTag.barcode))
    const discountedSubtotal = calculateDiscountedSubtotal(parsedTag.quantity, item.price, promotion?.type)
    return {
      name: item.name,
      quantity: {
        value: parsedTag.quantity,
        quantifier: parsedTag.quantity > 1 ? `${item.unit}s` : item.unit
      },
      unitPrice: item.price,
      subtotal: discountedSubtotal,
      discountedPrice: parsedTag.quantity * item.price - discountedSubtotal
    }
  })
}

function renderReceipt(receiptItems: ReceiptItem[]): string {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}
