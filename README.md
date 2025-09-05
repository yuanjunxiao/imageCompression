# 图片压缩工具

一款纯前端图片压缩工具，支持多种格式转换和压缩，保护您的隐私。

## 功能特点

- 纯浏览器处理，不上传服务器，保护隐私
- 支持多种图片格式（PNG, JPEG, WebP）
- 可调节压缩质量和尺寸
- 直观的压缩效果对比
- 批量处理功能
- 支持离线使用（PWA）

## 使用方法

1. 拖放图片或点击"选择文件"按钮上传图片
2. 调整压缩设置（格式、质量、尺寸等）
3. 预览压缩效果
4. 下载压缩后的图片

## 技术栈

- 原生HTML5/CSS3/JavaScript
- Web Workers用于后台处理
- IndexedDB用于本地存储
- Service Worker用于离线功能
- 第三方库：browser-image-compression, JSZip

## 本地运行

直接在浏览器中打开index.html文件即可使用。

## 浏览器兼容性

支持所有现代浏览器（Chrome, Firefox, Safari, Edge）的最新版本。

## 许可证

MIT