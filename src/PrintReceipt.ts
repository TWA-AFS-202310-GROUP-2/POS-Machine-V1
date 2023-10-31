import {loadAllItems, loadPromotions} from './Dependencies'
// interfaces definition
export interface Quantity{
  value: number
  quantifier: string
}

export interface ReceiptItem{
  name: string
  quantity: Quantity
  unitPrice: number
  subtotal: number
  discountedPrice: number
}

export interface Tag{
  barcode: string
  quantity: number
}

export function printReceipt(tags: string[]): string {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

// Receipt
export function renderPrintReceipt(receiptItems: ReceiptItem[]): string{
  if (!isValid(receiptItems)){
      return null
    }
  const tag = parseTags()
  const receiptItems = generateReceiptItems()
  // next step: transfer receiptItems to string and defined as receiptString
  return receiptString
}

// check if the tag is valid
export function isValid(tags: string[]): boolean{
  const list = loadAllItems()
  const barcodelist = list.map(bars => bars.barcode)
  return tags.some(tag => barcodelist.includes(tag))
}

// aggregate repeated tags
export function parseTags(tags: string[]):Tag[]{
  tags.forEach(itemTag=>{
    if (itemTag.length>10)
    {
      const addRepeatedItem = Number(itemTag.substring(10))
      for (let i = 0; i < addRepeatedItem - 1; i++)
      {
        tags.push(itemTag.substring(0,10))
      }
    }
  })
  let resultTags:Tag[]=[];
  const parsedTags = tags 
  const uniqueElements = [...new Set(parsedTags)]
  uniqueElements.forEach(element => 
    {
      const tag: Tag={} as Tag;
      tag.barcode = element;
      tag.quantity = parsedTags.filter(el => el === element).length;
      resultTags.push(tag);
    })
  return resultTags
}

// export function parseQuantity(): quantity{}

export function generateReceiptItems(tags: Tag[]): ReceiptItem[]{
  // pseudo code
  //use loadAllItems to get Item[]
  //use loadPromotion to get Promotion[]
  //use calculateDiscountedSubtotal to get discountedSubtotal
  //  Input: quantity, from Tag.quantity
  //         price, Item[one element].price
  //         promotionType, string "BUY_TWO_GET_ONE_FREE" or undefined
  //  Output: discountedSubtotal
  //  Check if some of Tag.barcode are in Promotion[].barcodes
  let total = 0
  const allItems = loadAllItems()
  const promotion = loadPromotions()
  for (const item of tags)
  {
    // find price that matches with item barcode in allItems
    // then call function calculateDiscountedSubtotal
  }
}
export function calculateDiscountedSubtotal(quantity: number, price: number, promotionType: string|undefined){
  let discountedSubtotal = 0
  if (quantity >= 2)
  {
    //apply "buy two get one free" promotion
    const freeItems = Math.floor(quantity / 3)
    discountedSubtotal = (quantity - freeItems) * price
  }
  return discountedSubtotal
}
  

