import convert from 'color-convert'

export function getSV(levels) {
  const results = []
  const step = 100 / (levels+1)

  for(let i = 1; i <= levels; i++) {
    const saturation = Math.floor(i * step)
    const value = Math.floor(-0.8 * saturation + 100)
    results.push([saturation, value])
  }
  return results
}

export function getColors(levels, hexColor) {
  const hue = convert.hex.hsv(hexColor)[0]
  const svArray = getSV(levels)
  const colors = svArray.map( sv => ('#' + convert.hsv.hex(hue, sv[0], sv[1])))

  return colors
}


  export function convertMoney(amount) {
    amount = Math.round(amount)
    let money = ''
    let abbr = ''
    if(typeof amount !== 'number' || amount <= 0) {
      return 'NO DATA'
    }
    if(amount<1000) {
      money = (''+amount)
      abbr = ''
    } else if(amount < 1000000) {
      money = (''+amount)
      money = money.substring(0,money.length-3)
      abbr = 'K'
    } else if(amount < 1000000000) {
      money = (''+amount)
      money = money.substring(0,money.length-6)
      abbr = 'M'
    } else {
      money = (''+amount)
      money = money.substring(0,money.length-9)
      abbr = 'B'
    }
    return money + abbr
  }
