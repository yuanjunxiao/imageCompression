/**
 * 纯前端水印工具
 * @param {File} imageFile - 图片文件
 * @param {Object} options - 配置项
 * @param {string} options.text - 水印文字
 * @param {number} [options.fontSize=20] - 字体大小
 * @param {string} [options.color='#FFFFFF'] - 字体颜色
 * @param {number} [options.opacity=0.7] - 透明度
 * @param {string} [options.position='bottom-right'] - 位置
 * @returns {Promise<Blob>} - 带水印的图片Blob
 */
export function addWatermark(imageFile, options) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 设置水印样式
      ctx.font = `${options.fontSize}px Arial`;
      ctx.fillStyle = `${options.color}${Math.floor(options.opacity * 255).toString(16).padStart(2, '0')}`;
      
      // 计算水印位置
      const padding = 10;
      let x, y;
      switch(options.position) {
        case 'top-left':
          x = padding;
          y = padding + options.fontSize;
          break;
        case 'top-right':
          x = img.width - ctx.measureText(options.text).width - padding;
          y = padding + options.fontSize;
          break;
        case 'bottom-left':
          x = padding;
          y = img.height - padding;
          break;
        default: // bottom-right
          x = img.width - ctx.measureText(options.text).width - padding;
          y = img.height - padding;
      }
      
      // 添加水印
      ctx.fillText(options.text, x, y);
      
      // 转换为Blob
      canvas.toBlob(resolve, imageFile.type || 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(imageFile);
  });
}