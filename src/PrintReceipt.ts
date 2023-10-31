import { loadAllItems, loadPromotions } from "./Dependencies";
import { Item, Promotion, Quantity, ReceiptItem, Tag } from "./Interface";

export function printReceipt(tags: string[]): string {
  return renderReceipt(generateReceiptItems(parseTags(tags)));

  //   return `***<store earning no money>Receipt ***
  // Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
  // Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
  // Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
  // ----------------------
  // Total：58.50(yuan)
  // Discounted prices：7.50(yuan)
  // **********************`;
}

function parseTags(tags: string[]): Tag[] {
  const parseTags: Tag[] = [];
  for (let tag of tags) {
    const parseTag = tag.split("-");
    if (parseTag.length === 1) {
      parseTags.push({ barcode: parseTag[0], quntity: 1 });
    } else {
      parseTags.push({ barcode: parseTag[0], quntity: Number(parseTag[1]) });
    }
  }
  return parseTags;
}

function generateReceiptItems(tags: Tag[]): ReceiptItem[] {
  const items: Item[] = loadAllItems();
  const promotions: Promotion[] = loadPromotions();

  const receiptItems: ReceiptItem[] = [];

  for (let tag of tags) {
    let find = 0;
    let existInReceiptItems = 0;
    let name: string = "";
    let unit: string = "";
    let unitPrice: number = 0;
    let subtotal: number = 0;
    let discountedPrice: number = 0;

    for (let item of items) {
      if (item.barcode === tag.barcode) {
        name = item.name;
        unitPrice = item.price;
        unit = item.unit;
        find = 1;
      }
    }
    if (find === 0) throw "Don't exist";

    for (let receiptItem of receiptItems) {
      if (name === receiptItem.name) {
        receiptItem.quantity.value += tag.quntity;
        existInReceiptItems = 1;

        break;
      }
    }

    if (existInReceiptItems === 0) {
      receiptItems.push({
        name: name,
        quantity: { value: tag.quntity, quntifier: unit },
        unitPrice: unitPrice,
        subtotal: subtotal,
        discountedPrice: discountedPrice,
      });
    }
  }

  for (let receiptItem of receiptItems) {
    if (receiptItem.name === "Coca-Cola" || "Sprite" || "Instant Noodles")
      receiptItem.subtotal = calculateDiscountedSubtotal(
        receiptItem.quantity.value,
        receiptItem.unitPrice,
        "BUY_TWO_GET_ONE_FREE"
      );
    else {
      receiptItem.subtotal = calculateDiscountedSubtotal(
        receiptItem.quantity.value,
        receiptItem.unitPrice,
        undefined
      );
    }
    receiptItem.discountedPrice =
      receiptItem.unitPrice * receiptItem.quantity.value - receiptItem.subtotal;
  }

  return receiptItems;
}

function calculateDiscountedSubtotal(
  quantity: number,
  price: number,
  promotionType: string | undefined
): number {
  if (promotionType === "BUY_TWO_GET_ONE_FREE") {
    quantity = quantity - Math.floor(quantity / 3);
  }
  return price * quantity;
}

function renderReceipt(receiptItems: ReceiptItem[]): string {
  let receipt: string = "***<store earning no money>Receipt ***\n";
  let subtotal: number = 0;
  let discountedPrice: number = 0;

  for (let receiptItem of receiptItems) {
    receipt += `Name：${receiptItem.name}，Quantity：${
      receiptItem.quantity.value
    } ${
      receiptItem.quantity.quntifier + "s"
    }，Unit：${receiptItem.unitPrice.toFixed(
      2
    )}(yuan)，Subtotal：${receiptItem.subtotal.toFixed(2)}(yuan)\n`;
    subtotal += receiptItem.subtotal;
    discountedPrice += receiptItem.discountedPrice;
  }
  receipt += `----------------------\nTotal：${subtotal.toFixed(
    2
  )}(yuan)\nDiscounted prices：${discountedPrice.toFixed(
    2
  )}(yuan)\n**********************`;

  return receipt;
}
