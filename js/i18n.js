// 多语言资源
const resources = {
  'zh-CN': {
    'app.title': '图片压缩工具',
    'app.description': '纯浏览器压缩，保护您的隐私',
    'app.metaDescription': '在线图片压缩工具 - 快速减小图片体积，保持高质量，支持JPG/PNG/WEBP格式，完全在浏览器中处理，保护您的隐私',
    'app.metaKeywords': '图片压缩,在线压缩,图片优化,JPG压缩,PNG压缩,WEBP转换',
    'app.ogTitle': 'ImageCompressor - 智能在线图片压缩工具',
    'app.ogDescription': '免费在线压缩图片，最高可减少80%文件体积，无需上传到服务器，完全在浏览器中处理',
    
    'upload.dragDrop': '拖放图片到这里',
    'upload.or': '或者',
    'upload.selectFile': '选择文件',
    'upload.supportedFormats': '支持格式: PNG, JPEG, WebP',
    'upload.maxFileSize': '最大文件大小: 10MB',
    
    'settings.title': '压缩设置',
    'settings.outputFormat': '输出格式',
    'settings.keepOriginal': '保持原格式',
    'settings.quality': '质量',
    'settings.resize': '调整尺寸',
    'settings.width': '宽度',
    'settings.height': '高度',
    'settings.reset': '重置',
    'settings.otherOptions': '其他选项',
    'settings.keepMetadata': '保留元数据',
    'settings.advancedOptions': '高级选项',
    'settings.colorMode': '色彩模式',
    'settings.rgb': 'RGB',
    'settings.grayscale': '灰度',
    'settings.pngCompression': 'PNG压缩级别',
    'settings.webpMode': 'WebP模式',
    'settings.lossy': '有损',
    'settings.lossless': '无损',
    
    'modal.aboutTitle': '关于图片压缩工具',
    'modal.aboutDescription1': '这是一款纯前端图片压缩工具，所有处理都在您的浏览器中完成，不会上传到任何服务器，保护您的隐私',
    'modal.aboutDescription2': '支持多种图片格式转换和压缩，提供直观的压缩效果对比',
    'modal.version': '版本: 1.0.0',
    'modal.helpTitle': '使用帮助',
    'modal.basicUsage': '基本使用',
    'modal.batchProcessing': '批量处理',
    'modal.faq': '常见问题',
    'modal.faq1': '<strong>Q: 为什么有些大图片处理很慢？</strong><br>A: 图片处理在浏览器中进行，大图片可能需要更多时间',
    'modal.faq2': '<strong>Q: 图片会上传到服务器吗？</strong><br>A: 不会，所有处理都在您的浏览器中完成'
  },
  'en': {
    'app.title': 'Image Compressor',
    'app.description': 'Browser-based compression, protect your privacy',
    'app.metaDescription': 'Online image compressor - Reduce image size quickly while maintaining high quality, supports JPG/PNG/WEBP formats, processed entirely in browser, protect your privacy',
    'app.metaKeywords': 'image compression,online compressor,image optimization,JPG compression,PNG compression,WEBP conversion',
    'app.ogTitle': 'ImageCompressor - Smart Online Image Compression Tool',
    'app.ogDescription': 'Free online image compression, reduce file size up to 80%, no server upload, processed entirely in browser',
    
    'upload.dragDrop': 'Drag & drop images here',
    'upload.or': 'or',
    'upload.selectFile': 'Select Files',
    'upload.supportedFormats': 'Supported formats: PNG, JPEG, WebP',
    'upload.maxFileSize': 'Max file size: 10MB',
    
    'settings.title': 'Compression Settings',
    'settings.outputFormat': 'Output Format',
    'settings.keepOriginal': 'Keep original',
    'settings.quality': 'Quality',
    'settings.resize': 'Resize',
    'settings.width': 'Width',
    'settings.height': 'Height',
    'settings.reset': 'Reset',
    'settings.otherOptions': 'Other Options',
    'settings.keepMetadata': 'Keep metadata',
    'settings.advancedOptions': 'Advanced Options',
    'settings.colorMode': 'Color Mode',
    'settings.rgb': 'RGB',
    'settings.grayscale': 'Grayscale',
    'settings.pngCompression': 'PNG Compression Level',
    'settings.webpMode': 'WebP Mode',
    'settings.lossy': 'Lossy',
    'settings.lossless': 'Lossless',
    
    'modal.aboutTitle': 'About Image Compressor',
    'modal.aboutDescription1': 'This is a pure front-end image compression tool, all processing is done in your browser, no upload to any server, protect your privacy',
    'modal.aboutDescription2': 'Support multiple image format conversion and compression, provide intuitive compression effect comparison',
    'modal.version': 'Version: 1.0.0',
    'modal.helpTitle': 'Help',
    'modal.basicUsage': 'Basic Usage',
    'modal.batchProcessing': 'Batch Processing',
    'modal.faq': 'FAQ',
    'modal.faq1': '<strong>Q: Why are some large images processed slowly?</strong><br>A: Image processing is done in the browser, large images may take more time',
    'modal.faq2': '<strong>Q: Will images be uploaded to server?</strong><br>A: No, all processing is done in your browser'
  }
};

// 初始化语言
let currentLang = localStorage.getItem('lang') || 'zh-CN';

// 切换语言函数
function changeLanguage(lang) {
  if (!resources[lang]) return;
  
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  
  // 更新所有带data-i18n属性的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (resources[lang][key]) {
      el.innerHTML = resources[lang][key];
    }
  });
  
  // 更新placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (resources[lang][key]) {
      el.placeholder = resources[lang][key];
    }
  });
}

// 初始化语言切换按钮
function initLanguageSwitcher() {
  document.querySelectorAll('.language-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  changeLanguage(currentLang);
  initLanguageSwitcher();
});