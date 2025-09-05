/**
 * 图片处理Worker
 * 在后台线程中处理图片，避免阻塞主线程
 */

// 导入必要的库
importScripts('../lib/browser-image-compression.min.js');

// 监听消息
self.addEventListener('message', async (e) => {
    try {
        const { file, settings, watermarkModulePath } = e.data;
        
        // 处理图片
        let result = await processImage(file, settings);
        
        // 如果需要添加水印
        if (settings.watermark && settings.watermark.enabled) {
            // 动态导入水印模块
            const { addWatermark } = await import(watermarkModulePath);
            
            // 将ArrayBuffer转换为Blob
            const blob = new Blob([result.buffer], { type: result.type });
            const watermarkedBlob = await addWatermark(new File([blob], file.name, { type: result.type }), settings.watermark);
            
            // 更新结果
            result.buffer = await readFileAsArrayBuffer(watermarkedBlob);
            result.type = watermarkedBlob.type;
        }
        
        // 返回结果
        self.postMessage({
            type: 'complete',
            data: {
                buffer: result.buffer,
                type: result.type
            }
        });
    } catch (error) {
        // 返回错误
        self.postMessage({
            type: 'error',
            error: error.message
        });
    }
});

/**
 * 处理图片
 * @param {File} file - 原始图片文件
 * @param {Object} settings - 处理设置
 * @returns {Promise<Object>} 处理结果
 */
async function processImage(file, settings) {
    // 创建处理选项
    const options = createProcessingOptions(file, settings);
    
    // 使用browser-image-compression库处理图片
    let compressedFile = await imageCompression(file, options);
    
    // 如果需要转换格式
    if (settings.outputFormat !== 'original') {
        compressedFile = await convertFormat(compressedFile, settings.outputFormat, settings);
    }
    
    // 读取文件内容
    const buffer = await readFileAsArrayBuffer(compressedFile);
    
    return {
        buffer: buffer,
        type: compressedFile.type
    };
}

/**
 * 创建处理选项
 * @param {File} file - 原始图片文件
 * @param {Object} settings - 处理设置
 * @returns {Object} 处理选项
 */
function createProcessingOptions(file, settings) {
    const options = {
        maxSizeMB: file.size / (1024 * 1024) * 0.9, // 默认压缩到原大小的90%
        maxWidthOrHeight: 1920, // 默认最大尺寸
        useWebWorker: false, // 我们已经在Worker中
        fileType: file.type,
    };
    
    // 设置质量
    if (settings.quality) {
        options.quality = settings.quality / 100;
    }
    
    // 设置输出格式
    if (settings.outputFormat !== 'original') {
        switch (settings.outputFormat) {
            case 'jpeg':
                options.fileType = 'image/jpeg';
                break;
            case 'png':
                options.fileType = 'image/png';
                break;
            case 'webp':
                options.fileType = 'image/webp';
                break;
        }
    }
    
    // 设置尺寸
    if (settings.width || settings.height) {
        if (settings.width) {
            options.maxWidthOrHeight = settings.width;
        }
        if (settings.height) {
            options.maxWidthOrHeight = Math.max(options.maxWidthOrHeight, settings.height);
        }
    }
    
    // 设置是否保留元数据
    options.preserveExif = settings.keepMetadata;
    
    // PNG特定设置
    if (options.fileType === 'image/png') {
        options.pngCompression = settings.pngCompression || 6;
    }
    
    // WebP特定设置
    if (options.fileType === 'image/webp') {
        options.webpMode = settings.webpMode || 'lossy';
    }
    
    return options;
}

/**
 * 转换图片格式
 * @param {File} file - 原始图片文件
 * @param {string} format - 目标格式
 * @param {Object} settings - 处理设置
 * @returns {Promise<File>} 转换后的文件
 */
async function convertFormat(file, format, settings) {
    return new Promise(async (resolve, reject) => {
        try {
            // 创建离屏Canvas
            const offscreenCanvas = new OffscreenCanvas(1, 1);
            const ctx = offscreenCanvas.getContext('2d');
            
            // 加载图片
            const img = await createImageBitmap(file);
            
            // 设置Canvas尺寸
            offscreenCanvas.width = img.width;
            offscreenCanvas.height = img.height;
            
            // 如果需要调整尺寸
            if (settings.width || settings.height) {
                const width = settings.width || img.width;
                const height = settings.height || img.height;
                
                // 保持宽高比
                if (settings.width && !settings.height) {
                    offscreenCanvas.width = width;
                    offscreenCanvas.height = (width / img.width) * img.height;
                } else if (!settings.width && settings.height) {
                    offscreenCanvas.height = height;
                    offscreenCanvas.width = (height / img.height) * img.width;
                } else {
                    offscreenCanvas.width = width;
                    offscreenCanvas.height = height;
                }
            }
            
            // 绘制图像
            ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            
            // 转换为指定格式
            let mimeType;
            let quality = settings.quality / 100;
            
            switch (format) {
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                default:
                    mimeType = file.type;
            }
            
            // 获取Blob
            const blob = await offscreenCanvas.convertToBlob({ type: mimeType, quality });
            
            // 创建新文件
            resolve(new File([blob], file.name, { type: mimeType }));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 将文件读取为ArrayBuffer
 * @param {File} file - 文件
 * @returns {Promise<ArrayBuffer>} ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('读取文件失败'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}