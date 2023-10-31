/* eslint-disable eol-last */
export interface Items{
    name: string;
    barcode: string;
    quantity:number;
    quantifier: string;
    unit:string;
    price: number;
    subtotal:number;
    discountedPrice: number;
}

export interface AllItems{
    barcode: string,
    name: string,
    unit: string,
    price: number
}

export interface Tag{
    barcode:string;
    quantity: number;
}
export interface Pro{
    type: string;
    barcodes: string[];
}