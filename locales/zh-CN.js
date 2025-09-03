/**
 * 中文语言包 (zh-CN)
 */

export default {
    // 页面标题和描述
    app: {
        title: '图片压缩工具',
        description: '纯浏览器压缩，保护您的隐私',
        metaDescription: '在线图片压缩工具 - 快速减小图片体积，保持高质量，支持JPG/PNG/WEBP格式，完全在浏览器中处理，保护您的隐私',
        metaKeywords: '图片压缩,在线压缩,图片优化,JPG压缩,PNG压缩,WEBP转换',
        ogTitle: 'ImageCompressor - 智能在线图片压缩工具',
        ogDescription: '免费在线压缩图片，最高可减少80%文件体积，无需上传到服务器，完全在浏览器中处理'
    },
    
    // 上传区域
    upload: {
        dragDrop: '拖放图片到这里',
        or: '或者',
        selectFile: '选择文件',
        supportedFormats: '支持格式: PNG, JPEG, WebP',
        maxFileSize: '最大文件大小: 10MB'
    },
    
    // 设置区域
    settings: {
        title: '压缩设置',
        outputFormat: '输出格式',
        keepOriginal: '保持原格式',
        quality: '质量',
        resize: '调整尺寸',
        width: '宽度',
        height: '高度',
        reset: '重置',
        otherOptions: '其他选项',
        keepMetadata: '保留元数据',
        advancedOptions: '高级选项',
        colorMode: '色彩模式',
        rgb: 'RGB',
        grayscale: '灰度',
        pngCompression: 'PNG压缩级别',
        webpMode: 'WebP模式',
        lossy: '有损',
        lossless: '无损'
    },
    
    // 预设
    presets: {
        title: '预设',
        web: '网页优化',
        social: '社交媒体',
        high: '高质量',
        small: '最小体积',
        presetName: '预设名称',
        savePreset: '保存当前设置'
    },
    
    // 预览区域
    preview: {
        title: '预览与对比',
        original: '原图',
        compressed: '压缩后',
        sideBySide: '并排对比',
        sliderCompare: '滑动对比',
        toggleMagnifier: '放大镜',
        compressionRatio: '压缩率',
        qualityScore: '质量评分',
        download: '下载压缩图片',
        reset: '重新设置',
        share: '分享工具'
    },
    
    // 批量处理
    batch: {
        title: '批量处理',
        processAll: '处理全部',
        downloadAll: '全部下载',
        downloadZip: '打包下载',
        processing: '处理中...'
    },
    
    // 页脚
    footer: {
        copyright: '© 2025 图片压缩工具 | 纯浏览器处理，保护您的隐私',
        about: '关于',
        help: '帮助',
        aboutUs: '关于我们',
        privacy: '隐私政策'
    },
    
    // 关于模态框
    aboutModal: {
        title: '关于图片压缩工具',
        description1: '这是一款纯前端图片压缩工具，所有处理都在您的浏览器中完成，不会上传到任何服务器，保护您的隐私。',
        description2: '支持多种图片格式转换和压缩，提供直观的压缩效果对比。',
        version: '版本: 1.0.0'
    },
    
    // 帮助模态框
    helpModal: {
        title: '使用帮助',
        basicUsage: '基本使用',
        step1: '拖放图片或点击"选择文件"按钮上传图片',
        step2: '调整压缩设置（格式、质量、尺寸等）',
        step3: '预览压缩效果',
        step4: '下载压缩后的图片',
        batchProcessing: '批量处理',
        batchDescription: '上传多张图片后，可以在批量处理区域统一设置参数并处理所有图片。',
        faq: '常见问题',
        q1: 'Q: 为什么有些大图片处理很慢？',
        a1: 'A: 图片处理在浏览器中进行，大图片可能需要更多时间。',
        q2: 'Q: 图片会上传到服务器吗？',
        a2: 'A: 不会，所有处理都在您的浏览器中完成。'
    },
    
    // 语言选择
    language: {
        title: '语言',
        zhCN: '简体中文',
        enUS: 'English',
        jaJP: '日本語',
        koKR: '한국어'
    },
    
    // 错误信息
    errors: {
        browserNotSupported: '您的浏览器不支持以下必要功能: {{features}}\\n请使用最新版Chrome/Firefox/Edge',
        fileTooBig: '文件太大，最大支持10MB',
        unsupportedFormat: '不支持的文件格式，请使用PNG、JPEG或WebP格式',
        processingFailed: '处理失败，请重试'
    }
};