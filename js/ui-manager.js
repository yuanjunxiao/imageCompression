/**
 * UI管理模块
 * 负责处理用户界面交互和更新
 */

export class UIManager {
    constructor(app) {
        this.app = app;
        this.comparisonMode = 'slider'; // 'slider' 或 'side-by-side'
        this.magnifierActive = false;
        this.notificationTimeout = null;
        
        // 创建通知元素
        this.createNotificationElement();
        
        // 创建加载指示器
        this.createLoadingIndicator();
        
        // 创建放大镜元素
        this.createMagnifier();
    }
    
    /**
     * 初始化UI
     */
    initUI() {
        // 初始化滑动对比功能
        this.initSliderComparison();
        
        // 应用保存的设置到UI
        this.updateSettingsUI(this.app.state.settings);
        
        console.log('UI管理器初始化完成');
    }
    
    /**
     * 更新设置UI
     * @param {Object} settings - 设置对象
     */
    updateSettingsUI(settings) {
        // 更新输出格式
        const outputFormat = document.getElementById('outputFormat');
        if (outputFormat && settings.outputFormat) {
            outputFormat.value = settings.outputFormat;
        }
        
        // 更新质量滑块
        const quality = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        if (quality && settings.quality !== undefined) {
            quality.value = settings.quality;
            qualityValue.textContent = `${settings.quality}%`;
        }
        
        // 更新尺寸输入
        const resizeWidth = document.getElementById('resizeWidth');
        const resizeHeight = document.getElementById('resizeHeight');
        if (resizeWidth && settings.width !== undefined) {
            resizeWidth.value = settings.width || '';
        }
        if (resizeHeight && settings.height !== undefined) {
            resizeHeight.value = settings.height || '';
        }
        
        // 更新元数据复选框
        const keepMetadata = document.getElementById('keepMetadata');
        if (keepMetadata && settings.keepMetadata !== undefined) {
            keepMetadata.checked = settings.keepMetadata;
        }
        
        // 更新颜色模式
        const colorMode = document.getElementById('colorMode');
        if (colorMode && settings.colorMode) {
            colorMode.value = settings.colorMode;
        }
        
        // 更新PNG压缩级别
        const pngCompression = document.getElementById('pngCompression');
        if (pngCompression && settings.pngCompression !== undefined) {
            pngCompression.value = settings.pngCompression;
        }
        
        // 更新WebP模式
        const webpMode = document.getElementById('webpMode');
        if (webpMode && settings.webpMode) {
            webpMode.value = settings.webpMode;
        }
    }
    
    /**
     * 显示/隐藏指定区域
     * @param {string} sectionId - 区域ID
     * @param {boolean} show - 是否显示
     */
    showSection(sectionId, show = true) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = show ? 'block' : 'none';
        }
    }
    
    /**
     * 设置加载状态
     * @param {boolean} isLoading - 是否正在加载
     */
    setLoading(isLoading) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'flex' : 'none';
        }
    }
    
    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (success, error, warning, info)
     * @param {number} duration - 显示时长(毫秒)
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        if (notification && notificationMessage) {
            // 清除之前的超时
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
            }
            
            // 设置消息和类型
            notificationMessage.textContent = message;
            notification.className = `notification ${type}`;
            
            // 显示通知
            notification.style.display = 'block';
            
            // 添加动画
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // 设置自动隐藏
            this.notificationTimeout = setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            }, duration);
        }
    }
    
    /**
     * 创建通知元素
     */
    createNotificationElement() {
        // 检查是否已存在
        if (document.getElementById('notification')) {
            return;
        }
        
        // 创建通知容器
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.style.display = 'none';
        
        // 创建通知消息
        const message = document.createElement('span');
        message.id = 'notificationMessage';
        
        // 创建关闭按钮
        const closeButton = document.createElement('span');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        });
        
        // 组装通知
        notification.appendChild(message);
        notification.appendChild(closeButton);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 4px;
                background-color: #f8f9fa;
                color: #202124;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 250px;
                max-width: 400px;
                transform: translateY(-20px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification.success {
                background-color: #d4edda;
                color: #155724;
                border-left: 4px solid #28a745;
            }
            
            .notification.error {
                background-color: #f8d7da;
                color: #721c24;
                border-left: 4px solid #dc3545;
            }
            
            .notification.warning {
                background-color: #fff3cd;
                color: #856404;
                border-left: 4px solid #ffc107;
            }
            
            .notification.info {
                background-color: #d1ecf1;
                color: #0c5460;
                border-left: 4px solid #17a2b8;
            }
            
            .notification-close {
                margin-left: 15px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            }
        `;
        
        // 添加到文档
        document.head.appendChild(style);
        document.body.appendChild(notification);
    }
    
    /**
     * 创建加载指示器
     */
    createLoadingIndicator() {
        // 检查是否已存在
        if (document.getElementById('loadingIndicator')) {
            return;
        }
        
        // 创建加载指示器容器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loadingIndicator';
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.style.display = 'none';
        
        // 创建加载动画
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        // 创建加载文本
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = '处理中...';
        
        // 组装加载指示器
        loadingIndicator.appendChild(spinner);
        loadingIndicator.appendChild(loadingText);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(66, 133, 244, 0.2);
                border-top: 5px solid #4285f4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-size: 18px;
                color: #4285f4;
            }
            
            @media (prefers-color-scheme: dark) {
                .loading-indicator {
                    background-color: rgba(32, 33, 36, 0.8);
                }
                
                .loading-text {
                    color: #8ab4f8;
                }
            }
        `;
        
        // 添加到文档
        document.head.appendChild(style);
        document.body.appendChild(loadingIndicator);
    }
    
    /**
     * 创建放大镜元素
     */
    createMagnifier() {
        // 检查是否已存在
        if (document.getElementById('magnifier')) {
            return;
        }
        
        // 创建放大镜元素
        const magnifier = document.createElement('div');
        magnifier.id = 'magnifier';
        magnifier.className = 'magnifier';
        
        // 添加到文档
        document.body.appendChild(magnifier);
    }
    
    /**
     * 初始化滑动对比功能
     */
    initSliderComparison() {
        const slider = document.querySelector('.comparison-slider');
        const sliderHandle = document.querySelector('.slider-handle');
        const compressedImage = document.querySelector('.compressed-image');
        
        if (!slider || !sliderHandle || !compressedImage) {
            return;
        }
        
        // 设置初始位置
        compressedImage.style.width = '50%';
        
        // 添加鼠标事件
        let isDragging = false;
        
        sliderHandle.addEventListener('mousedown', () => {
            isDragging = true;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            compressedImage.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        });
        
        // 添加触摸事件
        sliderHandle.addEventListener('touchstart', () => {
            isDragging = true;
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            compressedImage.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        });
    }
    
    /**
     * 设置对比模式
     * @param {string} mode - 对比模式 ('slider' 或 'side-by-side')
     */
    setComparisonMode(mode) {
        this.comparisonMode = mode;
        
        const comparisonSlider = document.querySelector('.comparison-slider');
        const originalImage = document.querySelector('.original-image');
        const compressedImage = document.querySelector('.compressed-image');
        const sliderHandle = document.querySelector('.slider-handle');
        
        if (!comparisonSlider || !originalImage || !compressedImage || !sliderHandle) {
            return;
        }
        
        if (mode === 'slider') {
            // 滑动对比模式
            originalImage.style.display = 'block';
            compressedImage.style.width = '50%';
            sliderHandle.style.display = 'block';
            sliderHandle.style.left = '50%';
            
            // 重置样式
            comparisonSlider.style.display = 'block';
            comparisonSlider.style.flexDirection = 'row';
            originalImage.style.position = 'absolute';
            compressedImage.style.position = 'absolute';
            originalImage.style.width = '100%';
        } else if (mode === 'side-by-side') {
            // 并排对比模式
            originalImage.style.display = 'block';
            compressedImage.style.width = '100%';
            sliderHandle.style.display = 'none';
            
            // 调整样式
            comparisonSlider.style.display = 'flex';
            comparisonSlider.style.flexDirection = 'row';
            originalImage.style.position = 'relative';
            compressedImage.style.position = 'relative';
            originalImage.style.width = '50%';
        }
    }
    
    /**
     * 切换放大镜功能
     */
    toggleMagnifier() {
        this.magnifierActive = !this.magnifierActive;
        
        const magnifier = document.getElementById('magnifier');
        const comparisonSlider = document.querySelector('.comparison-slider');
        
        if (!magnifier || !comparisonSlider) {
            return;
        }
        
        if (this.magnifierActive) {
            // 激活放大镜
            comparisonSlider.addEventListener('mousemove', this.handleMagnifier);
            comparisonSlider.addEventListener('mouseenter', () => {
                magnifier.style.display = 'block';
            });
            comparisonSlider.addEventListener('mouseleave', () => {
                magnifier.style.display = 'none';
            });
        } else {
            // 停用放大镜
            comparisonSlider.removeEventListener('mousemove', this.handleMagnifier);
            magnifier.style.display = 'none';
        }
    }
    
    /**
     * 处理放大镜移动
     * @param {Event} e - 鼠标事件
     */
    handleMagnifier = (e) => {
        const magnifier = document.getElementById('magnifier');
        const slider = document.querySelector('.comparison-slider');
        const originalImage = document.getElementById('originalImage');
        const compressedImage = document.getElementById('compressedImage');
        
        if (!magnifier || !slider || !originalImage || !compressedImage) {
            return;
        }
        
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 设置放大镜位置
        magnifier.style.left = `${x - 75}px`;
        magnifier.style.top = `${y - 75}px`;
        
        // 计算图像位置
        const originalRect = originalImage.getBoundingClientRect();
        const compressedRect = compressedImage.getBoundingClientRect();
        
        // 设置放大镜背景
        if (this.comparisonMode === 'slider') {
            // 滑动模式下，根据位置显示不同的图像
            const sliderPosition = parseFloat(compressedImage.style.width) / 100 * rect.width;
            
            if (x < sliderPosition) {
                // 显示原图
                const bgX = (x / originalRect.width) * 100;
                const bgY = (y / originalRect.height) * 100;
                magnifier.style.backgroundImage = `url(${originalImage.src})`;
                magnifier.style.backgroundPosition = `${bgX}% ${bgY}%`;
                magnifier.style.backgroundSize = `${originalRect.width * 2}px ${originalRect.height * 2}px`;
            } else {
                // 显示压缩图
                const bgX = ((x - sliderPosition) / compressedRect.width) * 100;
                const bgY = (y / compressedRect.height) * 100;
                magnifier.style.backgroundImage = `url(${compressedImage.src})`;
                magnifier.style.backgroundPosition = `${bgX}% ${bgY}%`;
                magnifier.style.backgroundSize = `${compressedRect.width * 2}px ${compressedRect.height * 2}px`;
            }
        } else {
            // 并排模式下，根据位置显示不同的图像
            if (x < rect.width / 2) {
                // 显示原图
                const bgX = (x / (rect.width / 2)) * 100;
                const bgY = (y / rect.height) * 100;
                magnifier.style.backgroundImage = `url(${originalImage.src})`;
                magnifier.style.backgroundPosition = `${bgX}% ${bgY}%`;
                magnifier.style.backgroundSize = `${originalRect.width * 2}px ${originalRect.height * 2}px`;
            } else {
                // 显示压缩图
                const bgX = ((x - rect.width / 2) / (rect.width / 2)) * 100;
                const bgY = (y / rect.height) * 100;
                magnifier.style.backgroundImage = `url(${compressedImage.src})`;
                magnifier.style.backgroundPosition = `${bgX}% ${bgY}%`;
                magnifier.style.backgroundSize = `${compressedRect.width * 2}px ${compressedRect.height * 2}px`;
            }
        }
    }
    
    /**
     * 更新批量处理列表
     * @param {Array} queue - 处理队列
     */
    updateBatchList(queue) {
        const batchList = document.getElementById('batchList');
        
        if (!batchList) {
            return;
        }
        
        // 清空列表
        batchList.innerHTML = '';
        
        // 添加队列项
        queue.forEach((item, index) => {
            const batchItem = document.createElement('div');
            batchItem.className = 'batch-item';
            
            // 创建缩略图
            const thumbnail = document.createElement('img');
            thumbnail.className = 'batch-thumbnail';
            thumbnail.src = URL.createObjectURL(item.file);
            thumbnail.alt = item.file.name;
            
            // 创建信息区域
            const info = document.createElement('div');
            info.className = 'batch-info';
            
            const name = document.createElement('div');
            name.className = 'batch-name';
            name.textContent = item.file.name;
            
            const size = document.createElement('div');
            size.className = 'batch-size';
            size.textContent = this.app.formatFileSize(item.file.size);
            
            info.appendChild(name);
            info.appendChild(size);
            
            // 创建状态
            const status = document.createElement('div');
            status.className = 'batch-status';
            status.textContent = this.getBatchItemStatusText(item);
            
            // 组装项目
            batchItem.appendChild(thumbnail);
            batchItem.appendChild(info);
            batchItem.appendChild(status);
            
            // 添加点击事件
            batchItem.addEventListener('click', () => {
                this.app.setCurrentImage(item.file);
            });
            
            // 添加到列表
            batchList.appendChild(batchItem);
        });
    }
    
    /**
     * 获取批处理项状态文本
     * @param {Object} item - 队列项
     * @returns {string} 状态文本
     */
    getBatchItemStatusText(item) {
        switch (item.status) {
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
     * 更新批处理进度
     * @param {number} current - 当前处理数量
     * @param {number} total - 总数量
     */
    updateBatchProgress(current, total) {
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
        
        // 如果完成，隐藏进度条
        if (current >= total) {
            setTimeout(() => {
                batchProgress.style.display = 'none';
            }, 2000);
        }
    }
}