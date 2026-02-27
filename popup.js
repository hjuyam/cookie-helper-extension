async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs || !tabs[0] || !tabs[0].url) throw new Error('无法获取当前标签页 URL');
  return tabs[0];
}

function getBaseDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

async function getCookiesForDomain(domain) {
  return chrome.cookies.getAll({ domain });
}

function normalizeCookie(c) {
  return {
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
    expirationDate: c.expirationDate,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: c.sameSite,
    session: c.session
  };
}

async function copyCookies() {
  const status = document.getElementById('status');
  status.textContent = '正在读取 Cookies...';
  try {
    const tab = await getActiveTab();
    const u = new URL(tab.url);
    if (!/^https?:$/.test(u.protocol)) throw new Error('仅支持 http/https 页面');

    const base = getBaseDomain(u.hostname);
    const cookies = await getCookiesForDomain(base);
    const payload = {
      site: u.hostname,
      baseDomain: base,
      exportedAt: new Date().toISOString(),
      cookies: cookies.map(normalizeCookie)
    };

    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    status.textContent = `已复制 ${cookies.length} 条 Cookies 到剪贴板`;
  } catch (e) {
    status.textContent = `复制失败：${e.message || e}`;
  }
}

async function clearCookiesCurrentSite() {
  const status = document.getElementById('status');
  status.textContent = '正在清空当前站点 Cookies...';
  try {
    const tab = await getActiveTab();
    const u = new URL(tab.url);
    if (!/^https?:$/.test(u.protocol)) throw new Error('仅支持 http/https 页面');

    const base = getBaseDomain(u.hostname);
    const cookies = await getCookiesForDomain(base);

    let removed = 0;
    for (const c of cookies) {
      const url = `${c.secure ? 'https' : 'http'}://${c.domain.startsWith('.') ? c.domain.slice(1) : c.domain}${c.path}`;
      try {
        const res = await chrome.cookies.remove({ url, name: c.name, storeId: c.storeId });
        if (res) removed++;
      } catch (_) {}
    }

    status.textContent = `已清理 ${removed}/${cookies.length} 条 Cookies。请刷新页面确认登出状态。`;
  } catch (e) {
    status.textContent = `清理失败：${e.message || e}`;
  }
}

(async function init() {
  const tab = await getActiveTab().catch(() => null);
  const urlEl = document.getElementById('url');
  if (tab?.url) {
    try {
      const u = new URL(tab.url);
      urlEl.textContent = `当前站点：${u.hostname}`;
    } catch {
      urlEl.textContent = '当前站点：未知';
    }
  } else {
    urlEl.textContent = '当前站点：未知';
  }

  document.getElementById('copy').addEventListener('click', copyCookies);
  document.getElementById('logout').addEventListener('click', clearCookiesCurrentSite);
})();
