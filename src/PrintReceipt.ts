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

function parseTags(tags: string[]): Tag[] {
  return []
}

function generateReceiptItems(parsedTags: Tag[]): ReceiptItem[] {
  return []
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
