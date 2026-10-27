# 嘉義市勞動力服務人員職業工會 官網(多頁靜態版)

純靜態網站,不需要資料庫或後端。把整個資料夾上傳到任何靜態空間即可
(Cloudflare Pages / Netlify / GitHub Pages / 一般虛擬主機皆可)。

## 檔案
- index.html 首頁(含「大家常問的問題」)
- join.html 入會方式(到會前要帶的東西、依投保級距的費用試算與對照表)
- benefits.html 勞保五大給付
- news.html 最新消息
- assets/style.css 全部樣式(配色在檔案最上方 :root)
- assets/app.js 共用互動(費用試算的級距與費率在「入會頁:費用試算」那一段,有註解)
- assets/img/ 封面照片(cover-*.jpg)、相關連結 logo(logo-*.png)、LINE QR code(line-qr.jpg)
- assets/favicon.png、apple-touch-icon.png 網站圖示;assets/img/logo-union.png(去背的屋頂人形標誌,放在左上角)、logo-union-full.png(含字的原檔,之後做「關於本會」可用)
- build_multi.py 產生四個頁面的腳本(只有開發者需要;日常改字直接改 html 即可)

本機預覽:在此資料夾執行 `python3 -m http.server 8000`,開 http://localhost:8000
(直接雙擊 html 也能開,但封面「每次瀏覽只出現一次」的判斷在 file:// 下較不準)。

## 上線前必須由工會確認(目前是暫定值)
1. 電話:(05) 216-7878、0983-871386
2. 費用:入會頁試算與級距 1–11(29,500～45,800 元)對照表已由工會確認(健保 5.17%、勞保 普通事故 11.5%＋職災 0.25%、會員自付 60%、會費 180、入會費 1,000)。
   日後費率調整時:改 assets/app.js「入會頁:費用試算」那段的公式,以及 join.html 內的對照表數字(兩處要一致)。
3. 會員福利清單、季繳/半年繳說明、收據說明
4. 最新消息:news.html 內目前為範例,請換成真實公告
5. 網域確定後再補 canonical、sitemap.xml、og:image

## 封面照片與圖片授權(請工會記錄)
- 封面三張工人照片來自免費圖庫(Pexels 授權/CC0),請在 assets/img/ 旁自行記下每張的原始下載頁網址與攝影師,以備查。
- Pexels 條款:不得暗示照片中人物或攝影師為本會背書、不得用於政治用途;照片中若有可辨識的人物,責任在使用者,建議有疑慮就換成本會自己拍的照片(同檔名覆蓋即可)。
- 相關連結的 logo 是各機關的標誌,僅作為連結識別,請確認使用方式沒有問題;若有官方提供的高解析檔可直接替換 assets/img/logo-*.png。
- 封面每次新開瀏覽(關掉分頁再開)才出現一次;同一次瀏覽中換頁、重新整理不會再出現。
- 頁尾「版權所有」寫法請工會決定:保留、刪除,或改成「© 2026 嘉義市勞動力服務人員職業工會」。
- 左上角英文名「Chiayi City Labor Force Service Personnel Occupational Union」是我們自行翻譯的,若工會有正式英文名請替換(各頁 header 的 .en 區塊)。

## 注意
- GSAP 動畫與 Google Fonts 從 CDN 載入;載入失敗時網站仍可閱讀(使用系統字型、無動畫)。
- 已在模擬 Chromium(iPhone 13 / SE / 320 寬 / iPad / 手機橫放 / 桌機 / 無 JS / 減少動態)測試;
  尚未在實體 iPhone / Safari 測過,LINE 連結與撥號請上線後用手機實測。

## 待辦與提醒（2026-10-22 整理）
- 照片來源：封面三張工人照片目前**沒有留下原始下載頁網址與攝影師記錄**，無法證明授權。正式上線前請換成工會自己拍的照片（同檔名覆蓋 assets/img/cover-*.jpg），或重新到 Pexels / Unsplash 找圖並記下每張的網址、攝影師、授權頁。
- 費用試算：116 年（2027）1 月 1 日起最低工資 30,900 元（勞動部 2026-09-24 公告審議結果，媒體報導行政院已核定）；勞保普通事故費率 12.5%→13%（含就業保險 1%，實際計收 12%）；健保投保薪資分級表第 1、2 級合併。新的投保薪資分級表與各費率公告後，須同步改 assets/app.js 的 GR（級距）、fLabor、fHealth，並更新 join.html 的級距對照表。
- 最新消息：文章資料在 news_data.py（build 前的來源），新增公告後執行 build_multi.py。勞保局三則為原文轉載並附出處與原公告網址。


## 版本
- 這包是「H2 版」：橘色配色、無封面、新 logo（粉紅花）、首頁有四個快速入口，版面為屋頂形主視覺與填色方塊。

## 上線前要做的事（這包已經準備好的與還要你補的）
已經放好：robots.txt、404.html、_headers（快取與基本安全標頭，Cloudflare Pages / Netlify 會自動讀）、
動畫套件放在 assets/vendor（不再依賴外部網站）、封面照片改 WebP、分享預覽圖 assets/og.jpg、首頁的結構化資料（JSON-LD，內容取自網站上的電話、地址與服務時間，請先確認正確）。

網域確定後：
1. 執行  SITE_URL=https://你的網域/ python3 build_multi.py
   會補上每頁的 canonical、分享預覽圖網址、sitemap.xml，並在 robots.txt 加上 Sitemap 一行。
2. 到 Google Search Console 驗證網域並送出 sitemap.xml；建立「Google 商家檔案」。
3. 在 Cloudflare Pages 開啟 Web Analytics（不需 cookie），看大家最常按電話、LINE 還是地圖。

## 上線到 Cloudflare Pages（直接上傳，不需要 GitHub）
1. 註冊並登入 Cloudflare → Workers & Pages → Create → Pages → Upload assets。
2. 專案名稱隨意（例如 chiayi-union），把「整個資料夾的內容」（不是 zip 檔本身，要先解壓縮）拖進去，Deploy。
3. 完成後會得到一個 xxx.pages.dev 的網址，先用手機和電腦打開檢查。
4. 有網域之後：專案的 Custom domains 加入網域，照畫面指示設定 DNS。
5. 網域確定後，請開發者執行  SITE_URL=https://你的網域/ python3 build_multi.py  再重新上傳一次（補上 canonical、sitemap、分享預覽圖網址）。


## 用 GitHub + Cloudflare Pages 上線（建議）
好處：之後改字或換照片，只要把新檔案上傳到 GitHub，網站幾分鐘內自動更新；每次改動都有紀錄，改壞了可以退回。

### 一、把檔案放進 GitHub
1. 登入 GitHub → 右上角 + → New repository。名稱例如 chiayi-union-site，選 Public（免費方案的 Cloudflare 連動可用私人倉庫，也可選 Private），不要勾 README，按 Create。
2. 進到新倉庫頁面，點 uploading an existing file。
3. 先把這包 zip 解壓縮，再把「資料夾裡面的所有檔案和資料夾」（index.html、assets 資料夾、_headers 等，不是 zip 檔、也不是外面那一層資料夾）整個拖進去。
4. 下面 Commit changes 按綠色按鈕。確認倉庫最上層看得到 index.html。

### 二、在 Cloudflare Pages 連到 GitHub
1. 登入 Cloudflare → Workers & Pages → Create → Pages → Connect to Git。
2. 授權 GitHub，選剛剛的倉庫，按 Begin setup。
3. Framework preset：None。Build command：留空。Build output directory：填 /（斜線）。按 Save and Deploy。
4. 完成後會得到 xxx.pages.dev 的網址，用手機與電腦檢查。

### 三、之後怎麼更新
到 GitHub 倉庫，點要改的檔案 → 右上鉛筆圖示直接改字 → Commit changes；或上傳新檔案覆蓋同名檔案。Cloudflare 會自動重新發佈。

### 四、綁網域
Cloudflare 專案 → Custom domains → Set up a custom domain，照畫面指示設定 DNS。
網域確定後，請開發者執行  SITE_URL=https://你的網域/ python3 build_multi.py  再把更新後的檔案傳到 GitHub（補上 canonical、sitemap、分享預覽圖網址）。

### 注意
- 倉庫不要放密碼、金鑰或會員個資；網站內容本身是公開的。
- _headers 是 Cloudflare Pages 專用的快取設定；若改用 GitHub Pages 則不會生效。
