# Firstgram Waitlist

Firstgram 的單頁等候名單前端 Prototype。表單只在瀏覽器內切換狀態，不會傳送或保存任何資料。

## 本機預覽

```bash
npm run build
npm run preview
```

開啟 `http://localhost:4173`。

## 部署到 Vercel

1. 將專案推送到 Git repository。
2. 在 Vercel 新增 Project，Root Directory 選擇 `Web/firstgram-waitlist`。
3. Framework Preset 選 `Other`；其餘設定會由 `vercel.json` 讀取。
4. 按下 Deploy。此純前端網站不需要環境變數、Token、資料庫或 API Key。
