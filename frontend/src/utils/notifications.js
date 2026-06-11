export function notify(message, type = 'success') {
  window.dispatchEvent(new CustomEvent('studyflow:notify', {
    detail: { message, type }
  }))
}

export function getErrorMessage(error, fallback = 'No se pudo completar la accion') {
  return error?.response?.data?.error || fallback
}
