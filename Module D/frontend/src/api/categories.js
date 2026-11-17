import api from "./client";

let categoriesPromise = null;
let cachedCategories = [];

function extractList(data) {
  if (Array.isArray(data)) return data;

  return data?.data || data?.categories || [];
}

export async function fetchCategories({ force = false } = {}) {
  if (!force && categoriesPromise) return categoriesPromise;

  categoriesPromise = api
    .get("/categories")
    .then(({ data }) => {
      cachedCategories = extractList(data);
      return cachedCategories;
    })
    .catch((error) => {
      categoriesPromise = null;
      throw error;
    });

  return categoriesPromise;
}

export function getCachedCategories() {
  return cachedCategories;
}
