export function handlePageView(location) {
  if (typeof window.ga === "function") {
    let page = "";
    if (location.pathname) {
      page += location.pathname;
    }
    if (location.search) {
      page += location.search;
    }
    window.ga("set", "page", page);
    window.ga("send", "pageview");
  }
}
