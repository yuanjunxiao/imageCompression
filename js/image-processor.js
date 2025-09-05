/**
 * 图片处理模块
 * 负责图片压缩、格式转换和尺寸调整等核心功能
 */

export class ImageProcessor {
    constructor() {
        // 初始化Web Worker池
        this.workerPool = [];
        this.maxWorkers = Math.max(1, navigator.hardwareConcurrency - 1) || 2;
        this.activeWorkers = 0;
        
        // 加载外部库
        this.imageCompression = window.imageCompression;
        
        console.log(`图片处理模块初始化，最大Worker数: ${this.maxWorkers}`);
    }
    
    /**
     * 处理单个图片
     * @param {File} file - 原始图片文件
     * @param {Object} settings - 处理设置
     * @returns {Promise<Object>} 处理结果，包含压缩后的文件和质量评分
     */
    async processImage(file, settings) {
        try {
            console.log('开始处理图片:', file.name, '大小:', file.size, '设置:', settings);
            
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                throw new Error('不支持的文件类型');
            }
            
            // 根据设置选择处理方法
            let processedFile;
            let qualityScore;
            
            // 使用Web Worker处理大图片
            if (file.size > 2 * 1024 * 1024) { // 2MB
                processedFile = await this.processWithWorker(file, settings);
            } else {
                // 使用主线程处理小图片
                processedFile = await this.processWithMainThread(file, settings);
            }
            
            // 计算质量评分
            qualityScore = await this.calculateQualityScore(file, processedFile);
            
            return {
                file: processedFile,
                qualityScore: qualityScore
            };
        } catch (error) {
            console.error('处理图片时出错:', error);
            throw error;
        }
    }
    
    /**
     * 在主线程中处理图片
     * @param {File} file - 原始图片文件
     * @param {Object} settings - 处理设置
     * @returns {Promise<File>} 处理后的文件
     */
    async processWithMainThread(file, settings) {
        try {
            // 创建处理选项
            const options = this.createProcessingOptions(file, settings);
            
            // 使用browser-image-compression库处理图片
            let compressedFile = await this.imageCompression(file, options);
            
            // 如果需要转换格式
            if (settings.outputFormat !== 'original') {
                compressedFile = await this.convertFormat(compressedFile, settings.outputFormat, settings);
            }
            
            return compressedFile;
        } catch (error) {
            console.error('主线程处理图片时出错:', error);
            throw error;
        }
    }
    
    /**
     * 使用Web Worker处理图片
     * @param {File} file - 原始图片文件
     * @param {Object} settings - 处理设置
     * @returns {Promise<File>} 处理后的文件
     */
    async processWithWorker(file, settings) {
        return new Promise((resolve, reject) => {
            // 检查是否有可用的Worker
            if (this.activeWorkers >= this.maxWorkers) {
                // 如果没有可用的Worker，回退到主线程处理
                console.log('没有可用的Worker，回退到主线程处理');
                this.processWithMainThread(file, settings)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            try {
                // 创建新的Worker
                const worker = new Worker('workers/image-processor-worker.js');
                this.activeWorkers++;
                
                // 设置消息处理
                worker.onmessage = (e) => {
                    const { type, data, error } = e.data;
                    
                    if (type === 'error') {
                        console.error('Worker处理图片时出错:', error);
                        reject(new Error(error));
                    } else if (type === 'complete') {
                        // 将ArrayBuffer转换为Blob，然后创建File对象
                        const blob = new Blob([data.buffer], { type: data.type });
                        const processedFile = new File([blob], file.name, { type: data.type });
                        resolve(processedFile);
                    }
                    
                    // 释放Worker
                    worker.terminate();
                    this.activeWorkers--;
                };
                
                // 发送处理任务
                worker.postMessage({
                    file: file,
                    settings: settings
                });
            } catch (error) {
                console.error('创建Worker时出错:', error);
                this.activeWorkers--;
                
                // 回退到主线程处理
                console.log('Worker创建失败，回退到主线程处理');
                this.processWithMainThread(file, settings)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    
    /**
     * 创建处理选项
     * @param {File} file - 原始图片文件
     * @param {Object} settings - 处理设置
     * @returns {Object} 处理选项
     */
    createProcessingOptions(file, settings) {
        const options = {
            maxSizeMB: file.size / (1024 * 1024) * 0.9, // 默认压缩到原大小的90%
            maxWidthOrHeight: 1920, // 默认最大尺寸
            useWebWorker: false, // 我们自己管理Worker
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
    async convertFormat(file, format, settings) {
        return new Promise((resolve, reject) => {
            try {
                try {
                  const reader = new FileReader();
                  reader.onerror = () => {
                    console.error('文件读取失败');
                    reject(new Error('无法读取文件内容'));
                  };
                
                reader.onload = async (event) => {
                    try {
                        const img = new Image();
                        
                        img.onload = () => {
                            try {
                                // 创建Canvas
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                
                                // 设置Canvas尺寸
                                canvas.width = img.width;
                                canvas.height = img.height;
                                
                                // 如果需要调整尺寸
                                if (settings.width || settings.height) {
                                    const width = settings.width || img.width;
                                    const height = settings.height || img.height;
                                    
                                    // 保持宽高比
                                    if (settings.width && !settings.height) {
                                        canvas.width = width;
                                        canvas.height = (width / img.width) * img.height;
                                    } else if (!settings.width && settings.height) {
                                        canvas.height = height;
                                        canvas.width = (height / img.height) * img.width;
                                    } else {
                                        canvas.width = width;
                                        canvas.height = height;
                                    }
                                }
                                
                                // 如果需要灰度处理
                                if (settings.colorMode === 'grayscale') {
                                    ctx.filter = 'grayscale(100%)';
                                }
                                
                                // 绘制图像
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                
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
                                canvas.toBlob((blob) => {
                                    if (blob) {
                                        // 创建新文件
                                        const newFile = new File([blob], file.name, { type: mimeType });
                                        resolve(newFile);
                                    } else {
                                        reject(new Error('转换格式失败'));
                                    }
                                }, mimeType, quality);
                            } catch (error) {
                                console.error('Canvas处理图片时出错:', error);
                                reject(error);
                            }
                        };
                        
                        img.onerror = () => {
                            reject(new Error('加载图片失败'));
                        };
                        
                        img.src = event.target.result;
                    } catch (error) {
                        console.error('处理图片数据时出错:', error);
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('读取文件失败'));
                };
                
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('转换格式时出错:', error);
                reject(error);
            }
        });
    }
    
    /**
     * 计算质量评分
     * @param {File} originalFile - 原始图片文件
     * @param {File} processedFile - 处理后的图片文件
     * @returns {Promise<number>} 质量评分 (0-100)
     */
    async calculateQualityScore(originalFile, processedFile) {
        try {
            // 简单的质量评分算法
            // 这里只是一个示例，实际应用中可能需要更复杂的算法
            
            // 计算文件大小比例
            const sizeRatio = processedFile.size / originalFile.size;
            
            // 基于大小比例的简单评分
            // 如果压缩率高但保持了较好的质量，得分高
            // 如果压缩率低，得分低
            let score = 0;
            
            if (sizeRatio <= 0.2) {
                // 压缩率非常高，可能质量损失较大
                score = 70 + Math.round(sizeRatio * 100);
            } else if (sizeRatio <= 0.5) {
                // 压缩率适中
                score = 80 + Math.round(sizeRatio * 20);
            } else if (sizeRatio <= 0.8) {
                // 压缩率较低
                score = 85 + Math.round(sizeRatio * 10);
            } else {
                // 几乎没有压缩
                score = 90 + Math.round(sizeRatio * 5);
            }
            
            // 确保分数在0-100范围内
            return Math.min(100, Math.max(0, score));
        } catch (error) {
            console.error('计算质量评分时出错:', error);
            return null;
        }
    }
    
    /**
     * 批量处理图片
     * @param {Array} files - 图片文件数组
     * @param {Object} settings - 处理设置
     * @param {Function} progressCallback - 进度回调函数
     * @returns {Promise<Array>} 处理结果数组
     */
    async batchProcess(files, settings, progressCallback) {
        const results = [];
        let processed = 0;
        
        for (const file of files) {
            try {
                const result = await this.processImage(file, settings);
                results.push({
                    originalFile: file,
                    processedFile: result.file,
                    qualityScore: result.qualityScore
                });
            } catch (error) {
                console.error(`处理文件 ${file.name} 时出错:`, error);
                results.push({
                    originalFile: file,
                    error: error.message
                });
            }
            
            processed++;
            if (progressCallback) {
                progressCallback(processed, files.length);
            }
        }
        
        return results;
    }
}