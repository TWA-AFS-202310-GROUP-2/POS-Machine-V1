export interface Quantity {
  value: number;
  quntifier: string;
}

export interface ReceiptItem {
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice: number;
}

export interface Tag {
  barcode: string;
  quntity: number;
}

export interface Item {
  barcode: string;
  name: string;
  unit: string;
  price: number;
}

export interface Promotion {
  type: string;
  barcodes: string[];
}
