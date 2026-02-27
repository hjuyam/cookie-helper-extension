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
  "cookies": [
    {
      "name": "session",
      "value": "...",
      "domain": ".example.com",
      "path": "/",
      "expirationDate": 1770000000,
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

## 安全提示

- 仅用于你自己的账号与设备
- 不要把 cookie 发给第三方
- 退出登录后建议刷新页面确认状态
- 部分站点可能还使用 localStorage/sessionStorage 维持会话（本版本未清理）
