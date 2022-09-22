export function amountAddDecimals(amount: string, decimals = 18) {
    return amount + new Array(decimals).fill('0').join('')
  }