
import {loadAllItems, loadPromotions} from './Dependencies'
import {ReceiptItem} from './receiptItem'
import {Tag} from './tag'
import {Item} from './item'

export class PosMachine{
  items = loadAllItems()
  private itemsMap = this.buildItemsMap(this.items)
  private buildItemsMap(items: Item[]): Map<string, Item> {
    const itemsMap = new Map<string, Item>()
    for (const item of items) {
      itemsMap.set(item.barcode, item)
    }
    return itemsMap
  }
  public  printReceipt(tags: string[]): string {
    const parsedTags:Tag[] = this.parseTags(tags)
    //console.log(parsedTags)
    const receiptItem:ReceiptItem[] = this.generateReceiptItems(parsedTags)
    // add.console.log(receiptItem)
    const receiptString:string = this.renderReceipt(receiptItem)
    // console.log(receiptString)
    return receiptString
  }
  //解析tags
  private parseTags(tags: string[]) :Tag[]{
    const tagsMap = new Map<string, number>()
    //split each item
    tags.forEach((item) => {
      const parts = item.split('-')
      const barcode = parts[0]
      const quantity = this.parseQuantity(item)
      //add quantity
      if (tagsMap.has(barcode)) {
        tagsMap.set(barcode, tagsMap.get(barcode)! + quantity)
      } else {
        tagsMap.set(barcode, quantity)
      }
    })
    //build new Tag[]
    const parsedTags:Tag[] = []
    //push parsedTag
    tagsMap.forEach((quantity, barcode) => {
      parsedTags.push({ barcode, quantity })
    })
    return parsedTags
  }
  //获取单个quantity
  private parseQuantity(item: string): number {
    const parts = item.split('-')
    return parts.length > 1 ? parseFloat(parts[1]) : 1
  }

  private generateReceiptItems(parsedTags: Tag[]): ReceiptItem[] {
    const receiptItem :ReceiptItem[] = []
    const promotions  = loadPromotions()
    // 获取 barcodes 列表
    const promotionBarcodeList = promotions[0].barcodes
    // tags information
    for(let i =0; i<parsedTags.length;i++){
      const tag = parsedTags[i]
      const quantity = tag.quantity
      const barcode = tag.barcode
      const item = this.itemsMap.get(barcode)!
      const unitPrice = item.price
      const name = item.name
      let promotionType = undefined
      if (promotionBarcodeList.includes(barcode)) {
        promotionType = promotions[0].type
      }
      const subtotal = this.calculateDiscountedSubtotal(quantity, Number(unitPrice), promotionType)
      const discountedPrice = quantity * Number(unitPrice) - subtotal
      const tagLine: ReceiptItem = {
        barcode,
        name,
        quantity: { value: quantity, quantifier: 'no' },
        unitPrice,
        subtotal,
        discountedPrice
      }
      receiptItem.push(tagLine)
    }
    return receiptItem
  }

  private calculateDiscountedSubtotal(quantity: number, unitPrice: number, promotionType: string|undefined):number {
    let subtotalPrice = 0
    if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
      const freeQuantity = Math.floor(quantity / 3) // 买二送一
      subtotalPrice += (quantity - freeQuantity) * Number(unitPrice)
    } else {
      subtotalPrice += quantity * Number(unitPrice)
    }
    return subtotalPrice
  }

  private renderReceipt(receiptItem: ReceiptItem[]): string {
    let receiptString = '***<store earning no money>Receipt ***\n'
    //const allItem: Item[] = loadAllItems()
    receiptItem.forEach((item) => {
      const tagInfo = this.itemsMap.get(item.barcode)!
      //const tagInfo = allItem.find((a) => a.name === item.name)
      const unit = tagInfo.unit
      const name = tagInfo.name
      const quantity = item.quantity.value
      const unitPrice = item.unitPrice.toFixed(2)
      const subtotal = item.subtotal.toFixed(2)
      receiptString += `Name:${name},Quantity:${quantity} `
      receiptString += `${unit}s,Unit:${unitPrice}(yuan),Subtotal:${subtotal}(yuan)\n`
    }
    )
    // 计算 Total 和 Discounted prices
    const tatalPrice = receiptItem.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
    const total = parseFloat(tatalPrice).toFixed(2)
    const discountedPrices = (receiptItem.reduce((acc, item) => acc + item.discountedPrice, 0)).toFixed(2)

    receiptString += '----------------------\n'
    receiptString += `Total:${total}(yuan)\n`
    receiptString += `Discounted prices:${discountedPrices}(yuan)\n`
    receiptString += '**********************'

    return receiptString
  }
}





