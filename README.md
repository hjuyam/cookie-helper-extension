# Cookie Helper Extension (Local Use)

最小可实施版 Chrome 插件：
- 一键复制当前站点 Cookies（JSON）
- 一键退出登录（清空当前站点 Cookies）

> 适用于本地自用场景（如将登录态同步给本地脚本/MCP 工具）。

## 安装

1. 打开 Chrome：`chrome://extensions/`
2. 开启右上角 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择本仓库目录

## 使用

1. 打开目标网站页面（例如小红书）
2. 点击扩展图标
3. 选择：
   - **一键复制当前站点 Cookies（JSON）**
   - **一键退出登录（清空当前站点 Cookies）**

## 输出格式（复制）

复制到剪贴板的是 JSON，结构如下：

```json
{
  "site": "www.example.com",
  "baseDomain": "example.com",
  "exportedAt": "2026-02-27T14:00:00.000Z",
  "expirySummary": {
    "soonestExpiresAt": "2026-02-28T01:23:45.000Z",
    "latestExpiresAt": "2027-01-01T00:00:00.000Z",
    "minHoursToExpiry": 11.39,
    "maxHoursToExpiry": 7400.0,
    "sessionCookieCount": 2
  },
  "cookies": [
    {
      "name": "session",
      "value": "...",
      "domain": ".example.com",
      "path": "/",
      "expirationDate": 1770000000,
      "expiresAtISO": "2026-02-28T01:23:45.000Z",
      "httpOnly": true,
      "secure": true,
      "sameSite": "lax",
      "session": false
    }
  ]
}
```

## 权限说明

- `cookies`：读取/删除当前站点 cookie
- `tabs`：获取当前活动标签页 URL
- `host_permissions: <all_urls>`：允许对当前站点执行复制/清理

## Cookie 过期与失效提醒

- 插件现在会在导出 JSON 里附带 `expirySummary`，并在弹窗显示“最早过期时间预警”。
- 需注意：Cookie 的 `expirationDate` 只是“客户端最长保留时间”，并不等于服务端一定有效到那一刻。
- 你在浏览器里点击“退出登录”，通常只会清本地 Cookie；**已导出的 Cookie 快照不会自动失效**。
- 若要让旧快照彻底失效，需要执行服务端会话失效动作（如账号安全页退出设备、改密码等）。

## YouTube Cookie 有效性机制（简述）

- YouTube/Google 会话通常由多枚 Cookie 共同决定（如 `LOGIN_INFO`、`__Secure-3PSID*` 等）。
- 常见表现：
  - 某些 Cookie 的过期时间可长达数月；
  - 但服务端可提前吊销（风险检测、异地登录、手动退出所有设备、密码变更等）。
- 结论：**没有固定“必然有效 X 天”**。实务上应按“可随时失效”处理，按需短周期重导出。

## 安全提示

- 仅用于你自己的账号与设备
- 不要把 cookie 发给第三方
- 退出登录后建议刷新页面确认状态
- 部分站点可能还使用 localStorage/sessionStorage 维持会话（本版本未清理）
