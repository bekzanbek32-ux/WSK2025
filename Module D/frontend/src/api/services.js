import api from "./client";

export async function fetchPaidServices(advertId) {
  const { data } = await api.get(`/adverts/${advertId}/paid-services`);

  const list = Array.isArray(data) ? data : data?.data || [];

  return list.map((service) => ({
    ...service,
    name: String(service?.name || "").toLowerCase(),
    started_at: service?.started_at || service?.activated_at || null,
    expired_at: service?.expired_at || service?.expires_at || null,
  }));
}

export async function purchasePaidService(advertId, name) {
  const { data } = await api.post(`/adverts/${advertId}/paid-services`, {
    name,
  });

  return data;
}

export async function extendPaidService(advertId, serviceId) {
  const { data } = await api.post(
    `/adverts/${advertId}/paid-services/${serviceId}/extend`,
  );

  return data;
}
