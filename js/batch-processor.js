/**
 * 批处理模块
 * 负责批量处理图片和下载功能
 */

export class BatchProcessor {
    constructor(imageProcessor) {
        this.imageProcessor = imageProcessor;
        this.processedResults = [];
        this.isProcessing = false;
    }
    
    /**
     * 处理所有图片
     * @param {Array} queue - 处理队列
     * @param {Object} settings - 处理设置
     * @returns {Promise<Array>} 处理结果
     */
    async processAll(queue, settings) {
        if (this.isProcessing) {
            console.warn('已有处理任务正在进行');
            return;
        }
        
        this.isProcessing = true;
        this.processedResults = [];
        
        try {
            // 获取待处理的项目
            const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'error');
            
            if (pendingItems.length === 0) {
                console.log('没有待处理的项目');
                this.isProcessing = false;
                return [];
            }
            
            // 显示进度
            this.updateProgress(0, pendingItems.length);
            
            // 处理每个项目
            for (let i = 0; i < pendingItems.length; i++) {
                const item = pendingItems[i];
                
                // 更新状态
                item.status = 'processing';
                this.updateBatchItem(item);
                
                try {
                    // 处理图片
                    const result = await this.imageProcessor.processImage(item.file, settings);
                    
                    // 更新结果
                    item.compressedFile = result.file;
                    item.qualityScore = result.qualityScore;
                    item.status = 'completed';
                    
                    // 添加到结果列表
                    this.processedResults.push({
                        originalFile: item.file,
                        compressedFile: result.file,
                        qualityScore: result.qualityScore
                    });
                } catch (error) {
                    console.error(`处理文件 ${item.file.name} 时出错:`, error);
                    item.status = 'error';
                    item.error = error.message;
                }
                
                // 更新UI
                this.updateBatchItem(item);
                this.updateProgress(i + 1, pendingItems.length);
            }
            
            console.log('批处理完成，结果:', this.processedResults);
            return this.processedResults;
        } catch (error) {
            console.error('批处理过程中出错:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }
    
    /**
     * 下载所有处理完成的图片
     */
    downloadAll() {
        const completedItems = this.processedResults.filter(result => result.compressedFile);
        
        if (completedItems.length === 0) {
            console.warn('没有可下载的项目');
            return;
        }
        
        // 逐个下载
        completedItems.forEach(item => {
            this.downloadFile(item.compressedFile, this.getDownloadFileName(item.originalFile));
        });
    }
    
    /**
     * 打包下载所有处理完成的图片
     */
    async downloadAsZip() {
        const completedItems = this.processedResults.filter(result => result.compressedFile);
        
        if (completedItems.length === 0) {
            console.warn('没有可下载的项目');
            return;
        }
        
        try {
            // 检查JSZip是否可用
            if (!window.JSZip) {
                throw new Error('JSZip库未加载');
            }
            
            // 创建ZIP
            const zip = new JSZip();
            
            // 添加文件
            for (const item of completedItems) {
                const fileName = this.getDownloadFileName(item.originalFile);
                zip.file(fileName, item.compressedFile);
            }
            
            // 生成ZIP
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            // 下载ZIP
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            this.downloadFile(zipBlob, `compressed-images-${timestamp}.zip`);
        } catch (error) {
            console.error('创建ZIP文件时出错:', error);
            throw error;
        }
    }
    
    /**
     * 下载单个文件
     * @param {Blob|File} file - 要下载的文件
     * @param {string} fileName - 文件名
     */
    downloadFile(file, fileName) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * 获取下载文件名
     * @param {File} originalFile - 原始文件
     * @returns {string} 下载文件名
     */
    getDownloadFileName(originalFile) {
        const name = originalFile.name;
        const lastDotIndex = name.lastIndexOf('.');
        
        if (lastDotIndex === -1) {
            return `${name}-compressed`;
        }
        
        const baseName = name.substring(0, lastDotIndex);
        const extension = name.substring(lastDotIndex);
        
        return `${baseName}-compressed${extension}`;
    }
    
    /**
     * 更新批处理项
     * @param {Object} item - 队列项
     */
    updateBatchItem(item) {
        // 查找DOM元素
        const batchItems = document.querySelectorAll('.batch-item');
        
        for (const batchItem of batchItems) {
            const nameElement = batchItem.querySelector('.batch-name');
            if (nameElement && nameElement.textContent === item.file.name) {
                // 更新状态
                const statusElement = batchItem.querySelector('.batch-status');
                if (statusElement) {
                    statusElement.textContent = this.getStatusText(item.status);
                    
                    // 更新样式
                    batchItem.className = `batch-item ${item.status}`;
                }
                
                // 如果处理完成，更新大小信息
                if (item.status === 'completed' && item.compressedFile) {
                    const sizeElement = batchItem.querySelector('.batch-size');
                    if (sizeElement) {
                        const originalSize = this.formatFileSize(item.file.size);
                        const compressedSize = this.formatFileSize(item.compressedFile.size);
                        sizeElement.textContent = `${originalSize} → ${compressedSize}`;
                    }
                }
                
                break;
            }
        }
    }
    
    /**
     * 更新进度
     * @param {number} current - 当前处理数量
     * @param {number} total - 总数量
     */
    updateProgress(current, total) {
        const batchProgress = document.getElementById('batchProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!batchProgress || !progressFill || !progressText) {
            return;
        }
        
        // 显示进度条
        batchProgress.style.display = 'block';
        
        // 更新进度
        const percent = Math.round((current / total) * 100);
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `处理中... ${current}/${total}`;
        
        // 如果完成，延迟隐藏进度条
        if (current >= total) {
            setTimeout(() => {
                batchProgress.style.display = 'none';
            }, 2000);
        }
    }
    
    /**
     * 获取状态文本
     * @param {string} status - 状态
     * @returns {string} 状态文本
     */
    getStatusText(status) {
        switch (status) {
            case 'pending':
                return '待处理';
            case 'processing':
                return '处理中';
            case 'completed':
                return '已完成';
            case 'error':
                return '错误';
            default:
                return '';
        }
    }
    
    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}