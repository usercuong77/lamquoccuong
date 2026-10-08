(() => {
  const routes = [
    ["/", "Trang chính", "Home"],
    ["/edit/", "Edit video", "Edit"],
    ["/tank/index.html", "Tank 2D", "Tank"],
    ["/bio/", "Liên hệ", "Bio"],
    ["/nuoitoi/", "Nuôi Tôi", "Feed"]
  ];
  const path = window.location.pathname;
  const locale = (() => {
    try {
      return localStorage.getItem("lqc_locale") === "en" ? "en" : "vi";
    } catch {
      return "vi";
    }
  })();
  const isCurrent = (route) => route === "/"
    ? path === "/"
    : path === route || path.startsWith(route);
  const nav = document.createElement("nav");
  nav.className = "lqc-hub-dock";
  nav.setAttribute("aria-label", locale === "en" ? "Explore Cuong's websites" : "Khám phá các trang của Cường");
  nav.innerHTML = routes.map(([href, vi, en], index) => {
    const label = locale === "en" ? en : vi;
    const current = isCurrent(href) ? ' aria-current="page"' : "";
    return index === 0
      ? `<a class="lqc-hub-home" href="${href}"${current}>CUONGLQ <small>${label}</small></a>`
      : `<a href="${href}"${current}>${label}</a>`;
  }).join("");
  document.body.classList.add("lqc-hub-page");
  document.body.appendChild(nav);
})();
