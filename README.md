# node-rfid-reader-controller

Node.js為基礎的 Impinj Speedway R420 讀卡機控制器。

系統架構
====================
Impinj reader
  |
  |
(java)
  |
  |
node-rfid-reader-controller (Raspberry pi)
  |
(node.js)
  |
  |- Local log (USB drive)
  |
  |- Beardude_event: Local server (Windows tablet)
  |
  |- Beardude_event: Remote server (public site)


功能
====================
1. 開始/結束讀卡機的動作

2. 以每個session為單位，將讀卡機讀取的資料儲存至指定的檔案

3. 將讀取資料傳送至指定的API

4. 開啟socket.io，發佈讀取資料

路徑 (http get)
====================
- 開始    /api/start
- 結束    /api/end

Logging
====================
系統會依照config裡設定的路徑儲存讀卡紀錄。
To-do: 用array的方式依序選擇可用的路徑

App 管理 (PM2)
====================
To-do

設定 Raspberry Pi
====================
- 安裝OS
    https://www.raspberrypi.org/documentation/installation/installing-images/README.md
- 安裝 Node.js & NPM
- 安裝 Java
- 優化
    -- https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=61033

- 安裝 RPI-Monitor (http://IP-ADDRESS:8888)
    -- http://rpi-experiences.blogspot.tw/
