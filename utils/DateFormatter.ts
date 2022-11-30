class DateFormatterAbstraction {
  getDateString(dateVal: string | Date, options: { [key: string]: any } = {}) {
    const date = new Date(dateVal)

    // let uOptions: { [key: string]: any } = {
    //   weekday: 'long', // long|short|narrow
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    // }

    // if (options) {
    //   Object.assign(uOptions, options ?? {})
    // } else if (options === null) {
    //   uOptions = {}
    // }

    return date.toLocaleDateString('en-US', options)
  } // end method getDateString

  getFormattedTime(dateVal: string | Date) {
    const date = new Date(dateVal)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const suffix = hours >= 12 ? 'PM' : 'AM'

    let displayHour: number | string = hours >= 12 ? hours % 12 : hours

    if (Number(displayHour) < 10) {
      displayHour = `0${displayHour}`
    }

    return `${displayHour}:${minutes} ${suffix}`
  } // end method getFormattedTime
} // end class DateFormatterAbstraction

const DateFormatter = new DateFormatterAbstraction()

export default DateFormatter
