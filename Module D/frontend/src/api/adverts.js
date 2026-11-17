import api, { cleanParams } from "./client";

const advertCache = new Map();

function normalizePhotos(photos) {
  if (!photos) return [];

  let value = photos;

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        value = JSON.parse(trimmed);
      } catch {
        value = [trimmed];
      }
    } else {
      value = [trimmed];
    }
  }

  if (!Array.isArray(value)) value = [value];

  return value
    .map((photo) => {
      if (!photo) return "";
      if (typeof photo === "string") return photo;
      if (typeof photo === "object") {
        return photo.url || photo.path || photo.image_path || photo.name || "";
      }

      return "";
    })
    .filter(Boolean);
}

export function normalizeAdvert(raw) {
  if (!raw) return null;

  return {
    ...raw,
    photos: normalizePhotos(raw.photos),
  };
}

export function rememberAdverts(list = []) {
  list.forEach((advert) => {
    if (advert?.id) advertCache.set(String(advert.id), normalizeAdvert(advert));
  });
}

export function getCachedAdvert(id) {
  return advertCache.get(String(id)) || null;
}

function mergeAdvert(base, extra) {
  if (!extra) return base;

  return {
    ...base,
    ...extra,
    user: base.user || extra.user || null,
    category: base.category || extra.category || null,
    paidServices: base.paidServices || extra.paidServices || [],
    photos: base.photos?.length ? base.photos : extra.photos || [],
  };
}

export async function fetchAdverts(params = {}) {
  const { data } = await api.get("/adverts", {
    params: cleanParams(params),
  });

  const items = Array.isArray(data) ? data : data?.data || [];

  rememberAdverts(items);

  return {
    items: items.map(normalizeAdvert),
    total: Number(Array.isArray(data) ? items.length : data?.total ?? items.length),
    currentPage: Number(
      Array.isArray(data) ? params.page || 1 : data?.current_page ?? params.page ?? 1,
    ),
    lastPage: Number(Array.isArray(data) ? 1 : data?.last_page ?? 1),
    perPage: Number(Array.isArray(data) ? items.length : data?.per_page ?? 10),
  };
}

async function findAdvertInCatalog(id) {
  // The detail endpoint in some API builds returns the advert without its
  // relations. Public list responses include the author and category, so we
  // look the advert up there and merge the missing data.
  for (let page = 1; page <= 3; page += 1) {
    try {
      const result = await fetchAdverts({ page, per_page: 30 });
      const match = result.items.find((item) => String(item.id) === String(id));

      if (match) return match;

      if (page >= result.lastPage) break;
    } catch {
      return null;
    }
  }

  return null;
}

export async function fetchAdvert(id) {
  const { data } = await api.get(`/adverts/${id}`);
  const advert = normalizeAdvert(data?.advert || data);
  const cached = getCachedAdvert(id);

  if (!advert) return null;

  if (advert.category && advert.user) {
    return mergeAdvert(advert, cached);
  }

  const catalogMatch = cached?.user ? cached : await findAdvertInCatalog(id);

  return mergeAdvert(advert, catalogMatch);
}

export async function fetchMyAdverts(status) {
  const { data } = await api.get("/user/adverts", {
    params: cleanParams({ status }),
  });

  const items = Array.isArray(data) ? data : data?.data || [];

  rememberAdverts(items);

  return items.map(normalizeAdvert);
}

function extractAdvert(payload) {
  return normalizeAdvert(payload?.advert || payload);
}

export async function createAdvert(payload) {
  const { data } = await api.post("/adverts", payload);

  return extractAdvert(data);
}

export async function updateAdvert(id, payload) {
  const { data } = await api.patch(`/adverts/${id}`, payload);

  return extractAdvert(data);
}

export async function deleteAdvert(id) {
  await api.delete(`/adverts/${id}`);
}

export async function changeAdvertStatus(id, status) {
  const { data } = await api.post(`/adverts/${id}/update-status`, { status });

  return extractAdvert(data);
}

export function getAdvertPhoto(advert, index = 0) {
  return advert?.photos?.[index] || "";
}
