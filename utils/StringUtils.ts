class StringUtilsAbstraction {
  getNameInitials(nameString: string): string {
    nameString = nameString.trim() || ''
    let rv = nameString.charAt(0)
    const splittedName = nameString.replace(/\s+/g, ' ').split(' ') || []

    if (splittedName.length > 1) {
      rv += splittedName[1].charAt(0)
    }

    return rv.toUpperCase()
  } // end method getNameInitials

  formatPrice(amount: any, options?: Object) {
    const uOptions = {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }

    if (options && (Object.keys(options) || []).length > 0) {
      Object.assign(uOptions, options)
    }

    const formatter = new Intl.NumberFormat('en-US', uOptions)

    return formatter.format(Number(amount))
  } // end method formatPrice
} // end class StringUtilsAbstraction
const StringUtils = new StringUtilsAbstraction()

export default StringUtils
