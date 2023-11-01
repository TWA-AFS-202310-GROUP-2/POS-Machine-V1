import {PosMachine} from '../src/PrintReceipt'

describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', () => {
    // given
    const table = new PosMachine()
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]

    const expectText = `***<store earning no money>Receipt ***
Name:Sprite,Quantity:5 bottles,Unit:3(yuan),Subtotal:12(yuan)
Name:Litchi,Quantity:2.5 pounds,Unit:15(yuan),Subtotal:37.5(yuan)
Name:Instant Noodles,Quantity:3 bags,Unit:4.5(yuan),Subtotal:9(yuan)
----------------------
Total:58.5(yuan)
Discounted prices:7.5(yuan)
**********************`
    //when
    const rendered = table.printReceipt(tags)
    //then
    expect(rendered).toEqual(expectText)
  })
})
