## Introduction
紀錄屬於自己的餐廳清單，可以瀏覽餐廳、查看詳細資訊、甚至連結到地圖，基本操作功能如下：
- 查看所有餐廳
- 瀏覽餐廳的詳細資訊
- 連結餐廳的地址到Google地圖
- 搜尋特定餐廳

此次新增CRUD功能如下：
- 新增餐廳
- 編輯餐廳
- 刪除餐廳

## Get started
確認安裝`node.js`與`npm`後，將專案clone到本地，透過終端機進入資料夾輸入：

```
npm install
```

安裝完畢後，設定環境變數連線MongoDB：

```
MONGODB_URI=mongodb+srv://<Your MongoDB Account>:<Your MongoDB Password>@cluster0.xxxx.xxxx.net/<Your MongoDB Table><?retryWrites=true&w=majority
```

先啟動腳本將範例資料匯入資料庫後啟用服務：

```
npm run seed
npm run start
```

若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址：

```
Listening on http://localhost:5000
```

若欲暫停使用：

```
ctrl + c
```

## Packages
- Node.js 14.16.0
- Express 4.17.1
- Express-Handlebars 4.0.2
- Method-Override 3.0.0
- Bootstrap 4.0.0
- Font-awesome 5.8.1
- Mongoose 6.0.5