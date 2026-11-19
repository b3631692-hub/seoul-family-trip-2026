# 給後續 AI／Codex 的旅程修改契約

此專案的目的是讓使用者只說「第二天早上改去某處」時，AI **只動旅程資料，不改前端版型**。建議以使用者現場從網站「匯出 JSON」的最新草稿為基礎，避免丟失已勾選用品、修改票價及已確認預約。若拿不到最新草稿，請先提醒使用者匯出檔案；**不要直接以舊 `data/seoul2026.json` 覆寫本機變更。**

## 可以直接貼給 Codex 的通用指令

> 請修改這個專案的 **JSON 旅程資料**，不要改 CSS、DOM、JS 元件結構、SVG 筆觸規則、操作方式或已有的穩定 ID。先讀 `README.md`、`docs/ASSUMPTIONS.md`、`src/lib.js` 與最新匯出的 JSON（若有）。依我這次提出的日期／地點／預算變更，**只修改有關活動**，保留無關活動的已確認時間、`locked`、`bookingStatus`、費用來源、備註與路段人工設定。新增項目給穩定且不重複的 ID；刪除也要確認沒有已預約時段被誤刪。
>
> 每筆資料保留 `id`, `date` (YYYY-MM-DD), `start` (HH:MM), `durationMinutes`, `category`, `title`, `placeName`, `address`, `lat`, `lng`, `group`, `cost` (currency/items/status), `notes`, `locked`, `bookingStatus`, `visualKey`, `visualPriority` 等欄位。價格未知用 `null` 或空 `items`，不可填 0 假裝免費；車程與營業資訊若未查證，標為估算／待查，附官方來源時保留 URL。
>
> 交通資料的 key 是 `fromId=>toId`。修改後由程式自動依相鄰行程產生有效路段；**只補／修改受影響路段的人工時長與費用**，其餘路段不重寫。保留 `routeOverrides` 中其他人工已核實的紀錄；有衝突就列出警告，不要擅自移動鎖定預約。新增日期或新目的地時以 `startDate`/`endDate` 驅動日期列與日數，按新的景點選題更新 `visualKey`。執行 `npm test`、`npm run artwork` 並回報哪些資料確定、哪些待查。
>
> 請輸出可匯回網站的完整 JSON、修改摘要與受到影響的交通／費用清單。不要假裝已有雲端共編，除非另外建立後端、登入及金鑰管理。

## 常見修改範例

**「第二天改成雨天備案，保留已預約的午餐」**：找到 2026-12-17 的事件；若午餐 `locked=true` 或明示要保留，完全不動其日期／時間。調整戶外景點（如 `d2-bukchon`）或新增室內候選，依同日活動的地理順序重新評估相鄰路段，無官方交通時填未知或估算；更新受影響項目的 `visualKey`，列出最緊迫的衝突。

**「加入兩位旅客，按新的票價規則更新預算」**：更新 `travellers.adults` / `travellers.children`，**同時逐筆查核相關 `cost.items` 的單價、年齡折扣、數量、車輛容量**。不要簡單把所有票價乘 12：機場巴士、團體優惠、幼兒免費／座位、包車與預訂車型規則不同。已知與未知費用清楚分開。

**「改成七天六夜、保持目前 UI」**：更新 `startDate` / `endDate`，保留現存事件 ID；新增日的事件給新 ID，無行程日會顯示空狀態和通用 SVG。若改目的地需先查官方資料，適度更新 `destination`、`country`、`timezone`、`currency`、`exchangeRates`；請勿僅替換標題留下舊地理位置。執行 `npm run artwork` 另存日期 SVG。

## 檢查清單

- [ ] 調整前備份使用者當前 JSON，並確認鎖定時段未移動。
- [ ] 保留所有未變動項目的 id、原已查證資料、人工路段、完成勾選狀態。
- [ ] `date` 在起訖區間內，`start` 24 小時制，`durationMinutes` 正整數。
- [ ] 多人分組 `A` / `B` 的平行活動不視為全團碰撞。
- [ ] 新增／刪除／移動只影響相鄰路段；不再相鄰的舊路段金額不進總預算。
- [ ] `cost.items[*].unitPrice` 可為 `null`，只有官方已查證免費才是數字 `0`。
- [ ] 使用 `Intl` 支援的 IANA 時區；ICS 出口以當地年月日時產生。
- [ ] 如果沒有真實道路線形資料，不要把兩點直線當實際路線。
- [ ] 按當日真正代表性活動生成新的 40×30 SVG，品牌 SVG 維持 251×66。
- [ ] `node --test tests/data.test.js` 與 `node tests/render_smoke.mjs` 通過，尚未完成的瀏覽器／裝置測試要誠實說明。
