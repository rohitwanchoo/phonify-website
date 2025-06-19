export async function updateCrmLabel(id: number, payload: any) {
  return await useApi().post(`/crm-update-label/${id}`, payload)
}
