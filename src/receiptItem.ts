export interface ReceiptItem{
    barcode:string;
    name:string;
    quantity:Quantity;
    unitPrice: number;
    subtotal:number;
    discountedPrice:number
}
export interface Quantity{
    value:number;
    quantifier:string
}
