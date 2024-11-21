export const formatCurrency = (
  value: number | string,
  lang: string = 'en-US',
  style: 'currency' | 'decimal' | 'percent' = 'currency',
  currency: string = 'USD'
): string => {
  const money = Number(value)

  if (isNaN(money)) {
    return String(value)
  }

  return new Intl.NumberFormat(lang, {
    style,
    currency,
  }).format(money)
}

export const formatStatusMobile = (status: string): string => {
  const statusMap: Record<string, string> = {
    NEW: 'Nuevo',
    USED: 'Seminuevo',
    REFURBISHED: 'Reacondicionado',
  }

  return statusMap[status] || 'Sin estado'
}

export const formatStatus = (state: string): string => {
  switch (state) {
    case 'new':
      return 'Nuevo'
    case 'used':
      return 'Usado'
    case 'refurbished':
      return 'Reacondicionado'
    default:
      return 'Estado'
  }
}
