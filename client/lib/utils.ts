export const setURLParams = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);
  window.history.replaceState(
    null,
    "",
    `${window.location.origin}?${String(params)}`,
  );
};
