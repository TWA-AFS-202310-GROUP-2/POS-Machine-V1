/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { clear } from 'console';
import {loadAllItems, loadPromotions} from './Dependencies'
import { AllItems, Items, Pro, Tag } from './Models'



export function printReceipt(buyList: string[]): string 
{
  setItemsFromDatabase();
  setProItems();
  if(!isValid(buyList))
  {
    return 'error input';
  }
  const tags:Tag[]= transToTag(buyList);
  const items:Items[] = setItems(tags);
  computePayment(items);
  const discounte:number = computeDiscount(items);
  const totalPayment:number = computeTotalPayment(items);
  const resultPrint:string = print(items,totalPayment,discounte);
  return resultPrint;
}

let allItems:AllItems[]=[];
let proItems:string[]=[];
const itemNames:string[]=[];
export function isValid(payItems:string[]):boolean
{
  let flag = true;
  //console.log(itemNames);
  payItems.forEach(p=>
  {
    const pay:string = p.substring(0,10);
    //console.log(pay);

    if(itemNames.indexOf(pay)===-1)
      flag=false;
  }
  );
  return flag;
}
export function setItemsFromDatabase()
{
  allItems= loadAllItems();
  allItems.forEach(a=>itemNames.push(a.barcode));
}
export function setProItems()
{
   const pros:Pro[]= loadPromotions();
  proItems= pros[0].barcodes;
}
export function transToTag(buyList:string[]):Tag[]
{
  //console.log(buyList);
  const tags:Tag[]=[];
  const tmpMap = new Map<string,number>();
  for(let i=0;i<buyList.length;i++)
  {
    let code='';
     code=buyList[i].substring(0,10);
    let num=1;
    if(buyList[i].length>10)
    {
      num=Number(buyList[i].substring(11));
      //console.log(buyList[i].substring(11));
    }
    if(tmpMap.has(code))
    {
      const res:number = tmpMap.get(code)!;
      //console.log(code+" "+res);
      tmpMap.delete(code);
      tmpMap.set(code,res+num);
    }
    else
    {
      tmpMap.set(code,num);
    }
    //console.log(tmpMap);
  }
  tmpMap.forEach((value:number,key:string)=>
  {
    //console.log(key+" "+value);
    const tag: Tag={} as Tag;
    tag.barcode=key;
    tag.quantity=value;
    tags.push(tag);
  }
)
  //console.log(tags);
  return tags;
}


export function setItems(tags:Tag[]):Items[]
{
  const items:Items[]=[];
  tags.forEach(tag=>
    {
      const ite: Items={} as Items;
      ite.discountedPrice=0;
      ite.subtotal=0;
      allItems.forEach(ai=>{
        if(ai.barcode==tag.barcode)
        {
          ite.name=ai.name;
          ite.price=ai.price;
          ite.unit=ai.unit;
          
        }
      });
      ite.barcode=tag.barcode;
      ite.quantity=tag.quantity;
      ite.quantifier='';
      items.push(ite);
    })
    return items;
}

export function computePayment(items:Items[])
{
  items.forEach(item=>{
    if(proItems.find(x=>x==item.barcode))
    {
      item.discountedPrice=Math.floor(item.quantity/3)*item.price;
    }
    item.subtotal=item.price*item.quantity-item.discountedPrice;
  })
}

export function computeTotalPayment(items:Items[]):number
{
  let totalPayment =0;
  items.forEach(item=>
    {
      totalPayment+=item.subtotal;
    })
    return totalPayment;
}
export function computeDiscount(items:Items[]):number
{
  let discountedPrice =0;
  items.forEach(item=>
    {
      discountedPrice+=item.discountedPrice;
    })
    return discountedPrice;
}
 export function print(items: Items[],totalPayment:number,discountedPrice:number):string
 {
  const receipt:string[]=[];
  let subReceipt='';
  items.forEach(item => {
    subReceipt=`Name：${item.name}，Quantity：${item.quantity} ${item.unit}s，Unit：${Number(item.price).toFixed(2)}(yuan)，Subtotal：${Number(item.subtotal).toFixed(2)}(yuan)`;
    receipt.push(subReceipt);
  });
  receipt.unshift('***<store earning no money>Receipt ***');
  receipt.push('----------------------');
  receipt.push(`Total：${Number(totalPayment).toFixed(2)}(yuan)`);
  receipt.push(`Discounted prices：${Number(discountedPrice).toFixed(2)}(yuan)`);
  receipt.push('**********************');
  const result:string = receipt.join('\n');
  return result;
}
