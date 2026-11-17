/** Normalises paid-service records coming from different API endpoints. */
export function normalizeService(service = {}) {
  return {
    ...service,
    name: String(service.type || service.name || "").toLowerCase(),
    started_at: service.started_at || service.activated_at || null,
    expired_at: service.expired_at || service.expires_at || null,
  };
}

export function isServiceActive(service) {
  const expires = service?.expired_at || service?.expires_at;

  if (!service || service.deactivated_at || !expires) return false;

  const time = new Date(String(expires).replace(" ", "T")).getTime();

  return Number.isFinite(time) && time > Date.now();
}

/** Active services, one entry per service type, newest first. */
export function getActiveServices(services = []) {
  const seen = new Set();

  return (Array.isArray(services) ? services : [])
    .map(normalizeService)
    .filter((service) => isServiceActive(service))
    .filter((service) => {
      if (!service.name || seen.has(service.name)) return false;

      seen.add(service.name);

      return true;
    });
}

export function isAdvertOwner(advert, user) {
  if (!advert || !user) return false;

  return String(advert.user_id) === String(user.id);
}

/** Whole days left before the service expires. */
export function daysLeft(value) {
  if (!value) return 0;

  const time = new Date(String(value).replace(" ", "T")).getTime();

  if (!Number.isFinite(time)) return 0;

  return Math.max(0, Math.ceil((time - Date.now()) / 86_400_000));
}
