export const getSearchParams = object => {
  return new URLSearchParams(object).toString();
}

export const getSearchParam = key => {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get(key)
}