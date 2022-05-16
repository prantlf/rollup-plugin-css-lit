export default function handleError({ message, reason, column, line }) {
  if (reason) {
    this.error(reason,{ column, line })
  /* c8 ignore next 3 */
  } else {
    this.error(message)
  }
}
