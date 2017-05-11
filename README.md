# node-rfid-reader-controller

Node.js為基礎的 Impinj Speedway R420 讀卡機控制器。

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
