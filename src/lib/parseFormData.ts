// lib/parseFormData.ts

export async function parseFormData(formData: FormData) {
  const result: Record<string, any> = {}
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!result.images) result.images = []
      result.images.push(value)
    } else {
      result[key] = value
    }
  }
  return result
}
