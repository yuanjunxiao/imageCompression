# 图片压缩工具水印功能设计文档

## 1. 功能概述
新增水印功能允许用户在压缩图片时添加文字或图片水印，不影响现有压缩流程和UI布局。

## 2. 技术实现方案

### 2.1 纯前端实现
```javascript
// 使用canvas实现水印
function addWatermark(imageFile, options) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 添加水印
      ctx.font = `${options.fontSize || 20}px Arial`;
      ctx.fillStyle = `rgba(255,255,255,${options.opacity || 0.7})`;
      ctx.fillText(options.text, 10, img.height - 20);
      
      // 转换为Blob
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(imageFile);
  });
}
```

### 2.2 前端集成
- 在现有上传组件中新增水印选项开关
- 保持现有UI色调，仅增加水印设置面板
- 水印处理完全在浏览器中完成

## 3. 前端配置

### 3.1 水印配置项
```javascript
{
  text: '水印文字', // 必填
  fontSize: 20,    // 可选，默认20px
  color: '#FFFFFF', // 可选，默认白色
  opacity: 0.7,    // 可选，默认0.7
  position: 'bottom-right' // 可选，支持'top-left','top-right','bottom-left','bottom-right'
}

## 4. 使用说明
1. 在压缩配置中启用水印选项
2. 设置水印内容（文字/图片）
3. 调整透明度和位置
4. 正常上传图片

## 5. 注意事项
- 水印功能默认关闭，不影响现有流程
- 纯前端处理不会增加服务器负担
- 建议水印文字不超过20个字符
- 大图片处理可能需要较长时间（取决于用户设备性能）
- 仅支持现代浏览器（Chrome, Firefox, Edge等）
