import {printReceipt} from '../src/PrintReceipt'

describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', () => {
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
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`

    expect(printReceipt(tags)).toEqual(expectText)
  })

  it('should print exception with invalid barcode when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
      'ITEM000006'
    ]

    const expectText = '[ERROR]: barcode not found'

    expect(printReceipt(tags)).toEqual(expectText)
  })

  it('should print exception with invalid format when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001*',
      'ITEMA00003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]

    const expectText = '[ERROR]: invalid format'

    expect(printReceipt(tags)).toEqual(expectText)
  })

  it('should print exception with invalid rule when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEMA00003-2.5',
      'ITEM000005',
      'ITEM000005-2.5',
    ]

    const expectText = '[ERROR]: invalid rule'

    expect(printReceipt(tags)).toEqual(expectText)
  })

})
