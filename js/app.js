/**
 * 图片压缩工具主应用
 * 版本: 1.0.0
 */
import { ImageProcessor } from './image-processor.js';
import { UIManager } from './ui-manager.js';
import { StorageManager } from './storage-manager.js';
import { BatchProcessor } from './batch-processor.js';

// 修改为全局变量方式确保Chrome兼容性
window.ImageCompressorApp = class {
    constructor() {
        // 初始化各个管理器
        this.imageProcessor = new ImageProcessor();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager(this);
        this.batchProcessor = new BatchProcessor(this.imageProcessor);
        
        // 应用状态
        this.state = {
            currentImage: null,
            originalFile: null,
            compressedFile: null,
            processingQueue: [],
            settings: this.getDefaultSettings(),
            presets: this.loadPresets(),
            history: []
        };
        
        // 初始化应用
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        // 设置事件监听器
        this.setupEventListeners();
        
        // 加载保存的设置
        this.loadSavedSettings();
        
        // 检查是否支持所需的API
        this.checkBrowserSupport();
        
        // 初始化UI
        this.uiManager.initUI();
        
        console.log('图片压缩工具已初始化');
        
        // 确保应用实例全局可用
        window.app = this;
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 文件上传相关
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const selectFileBtn = document.getElementById('selectFileBtn');
        
        // 确保按钮和输入元素存在
        if (!selectFileBtn || !fileInput) {
            console.error('无法找到文件选择按钮或文件输入元素');
            return;
        }
        
        // 添加点击事件监听器
        selectFileBtn.addEventListener('click', () => {
            console.log('文件选择按钮点击');
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files);
            }
        });
        
        // 修复Mac系统上的文件选择问题
        selectFileBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认行为
            
            // 确保文件输入元素可见（Mac Safari需要）
            fileInput.style.display = 'block';
            fileInput.style.position = 'absolute';
            fileInput.style.visibility = 'visible';
            
            fileInput.click();
            
            // 恢复隐藏状态
            setTimeout(() => {
                fileInput.style.display = 'none';
                fileInput.style.position = 'static';
                fileInput.style.visibility = 'hidden';
            }, 100);
        });
        
        fileInput.addEventListener('change', (e) => {
            console.log('文件选择事件触发');
            if (fileInput.files && fileInput.files.length > 0) {
                console.log('选择了文件:', fileInput.files.length);
                this.handleFileUpload(fileInput.files);
            }
        });
        
        // 设置相关
        const outputFormat = document.getElementById('outputFormat');
        const quality = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        const resizeWidth = document.getElementById('resizeWidth');
        const resizeHeight = document.getElementById('resizeHeight');
        const resetSize = document.getElementById('resetSize');
        const keepMetadata = document.getElementById('keepMetadata');
        
        outputFormat.addEventListener('change', () => {
            this.updateSettings({ outputFormat: outputFormat.value });
            this.processCurrentImage();
        });
        
        quality.addEventListener('input', () => {
            qualityValue.textContent = `${quality.value}%`;
            this.updateSettings({ quality: parseInt(quality.value) });
        });
        
        quality.addEventListener('change', () => {
            this.processCurrentImage();
        });
        
        resizeWidth.addEventListener('change', () => {
            this.updateSettings({ width: resizeWidth.value ? parseInt(resizeWidth.value) : null });
            this.processCurrentImage();
        });
        
        resizeHeight.addEventListener('change', () => {
            this.updateSettings({ height: resizeHeight.value ? parseInt(resizeHeight.value) : null });
            this.processCurrentImage();
        });
        
        resetSize.addEventListener('click', () => {
            resizeWidth.value = '';
            resizeHeight.value = '';
            this.updateSettings({ width: null, height: null });
            this.processCurrentImage();
        });
        
        keepMetadata.addEventListener('change', () => {
            this.updateSettings({ keepMetadata: keepMetadata.checked });
            this.processCurrentImage();
        });
        
        // 高级设置
        const colorMode = document.getElementById('colorMode');
        const pngCompression = document.getElementById('pngCompression');
        const webpMode = document.getElementById('webpMode');
        
        colorMode.addEventListener('change', () => {
            this.updateSettings({ colorMode: colorMode.value });
            this.processCurrentImage();
        });
        
        pngCompression.addEventListener('change', () => {
            this.updateSettings({ pngCompression: parseInt(pngCompression.value) });
            this.processCurrentImage();
        });
        
        webpMode.addEventListener('change', () => {
            this.updateSettings({ webpMode: webpMode.value });
            this.processCurrentImage();
        });
        
        // 预设按钮
        const presetButtons = document.querySelectorAll('.preset-buttons button');
        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const presetName = button.dataset.preset;
                this.applyPreset(presetName);
            });
        });
        
        // 保存预设
        const savePresetBtn = document.getElementById('savePreset');
        const presetName = document.getElementById('presetName');
        
        savePresetBtn.addEventListener('click', () => {
            if (presetName.value.trim()) {
                this.savePreset(presetName.value.trim());
                presetName.value = '';
            }
        });
        
        // 预览控制
        const sideBySideBtn = document.getElementById('sideBySide');
        const sliderCompareBtn = document.getElementById('sliderCompare');
        const toggleMagnifierBtn = document.getElementById('toggleMagnifier');
        
        sideBySideBtn.addEventListener('click', () => {
            this.uiManager.setComparisonMode('side-by-side');
        });
        
        sliderCompareBtn.addEventListener('click', () => {
            this.uiManager.setComparisonMode('slider');
        });
        
        toggleMagnifierBtn.addEventListener('click', () => {
            this.uiManager.toggleMagnifier();
        });
        
        // 下载按钮
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => {
            this.downloadCompressedImage();
        });
        
        // 重置按钮
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.addEventListener('click', () => {
            this.resetToUpload();
        });
        
        // 批量处理按钮
        const processAllBtn = document.getElementById('processAllBtn');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const downloadZipBtn = document.getElementById('downloadZipBtn');
        
        processAllBtn.addEventListener('click', () => {
            this.batchProcessor.processAll(this.state.processingQueue, this.state.settings);
        });
        
        downloadAllBtn.addEventListener('click', () => {
            this.batchProcessor.downloadAll();
        });
        
        downloadZipBtn.addEventListener('click', () => {
            this.batchProcessor.downloadAsZip();
        });
        
        // 模态框
        const aboutLink = document.getElementById('aboutLink');
        const helpLink = document.getElementById('helpLink');
        const aboutModal = document.getElementById('aboutModal');
        const helpModal = document.getElementById('helpModal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.style.display = 'flex';
        });
        
        helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            helpModal.style.display = 'flex';
        });
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                aboutModal.style.display = 'none';
                helpModal.style.display = 'none';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.style.display = 'none';
            }
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });
    }
    
    /**
     * 处理文件上传
     * @param {FileList} files - 上传的文件列表
     */
    handleFileUpload(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.uiManager.showNotification('请上传有效的图片文件', 'error');
            return;
        }
        
        // 检查文件大小
        const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024); // 10MB
        if (oversizedFiles.length > 0) {
            this.uiManager.showNotification('部分文件超过10MB，可能会影响处理性能', 'warning');
        }
        
        // 添加到处理队列
        imageFiles.forEach(file => {
            this.state.processingQueue.push({
                file: file,
                originalSize: file.size,
                status: 'pending',
                compressedFile: null
            });
        });
        
        // 更新UI
        this.uiManager.updateBatchList(this.state.processingQueue);
        
        // 如果只有一个文件，直接处理
        if (imageFiles.length === 1) {
            this.setCurrentImage(imageFiles[0]);
        } else {
            // 显示批量处理区域
            document.getElementById('batchSection').style.display = 'block';
        }
    }
    
    /**
     * 设置当前处理的图片
     * @param {File} file - 图片文件
     */
    setCurrentImage(file) {
        this.state.originalFile = file;
        this.state.currentImage = URL.createObjectURL(file);
        
        // 更新UI
        this.uiManager.showSection('settingsSection');
        this.uiManager.showSection('previewSection');
        
        // 显示原图
        const originalImage = document.getElementById('originalImage');
        originalImage.src = this.state.currentImage;
        
        // 更新原图大小信息
        document.getElementById('originalSize').textContent = this.formatFileSize(file.size);
        
        // 处理图片
        this.processCurrentImage();
    }
    
    /**
     * 处理当前图片
     */
    async processCurrentImage() {
        if (!this.state.originalFile) return;
        
        try {
            // 显示加载状态
            this.uiManager.setLoading(true);
            
            // 处理图片
            const result = await this.imageProcessor.processImage(
                this.state.originalFile,
                this.state.settings
            );
            
            // 更新状态
            this.state.compressedFile = result.file;
            
            // 更新UI
            const compressedImage = document.getElementById('compressedImage');
            compressedImage.src = URL.createObjectURL(result.file);
            
            // 更新压缩后大小信息
            document.getElementById('compressedSize').textContent = this.formatFileSize(result.file.size);
            
            // 计算压缩率
            const compressionRatio = 100 - Math.round((result.file.size / this.state.originalFile.size) * 100);
            document.getElementById('compressionRatio').textContent = `${compressionRatio}%`;
            
            // 更新质量评分
            document.getElementById('qualityScore').textContent = result.qualityScore ? result.qualityScore : 'N/A';
            
            // 添加到历史记录
            this.addToHistory({
                originalFile: this.state.originalFile,
                compressedFile: result.file,
                settings: { ...this.state.settings },
                timestamp: new Date()
            });
        } catch (error) {
            console.error('处理图片时出错:', error);
            this.uiManager.showNotification('处理图片时出错: ' + error.message, 'error');
        } finally {
            // 隐藏加载状态
            this.uiManager.setLoading(false);
        }
    }
    
    /**
     * 下载压缩后的图片
     */
    downloadCompressedImage() {
        if (!this.state.compressedFile) return;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(this.state.compressedFile);
        
        // 生成文件名
        const originalName = this.state.originalFile.name;
        const extension = this.getFileExtension(this.state.compressedFile.type);
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        link.download = `${baseName}-compressed.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * 重置到上传状态
     */
    resetToUpload() {
        // 清除当前图片
        this.state.currentImage = null;
        this.state.originalFile = null;
        this.state.compressedFile = null;
        
        // 重置UI
        document.getElementById('settingsSection').style.display = 'none';
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('batchSection').style.display = 'none';
        
        // 清除文件输入
        document.getElementById('fileInput').value = '';
    }
    
    /**
     * 更新设置
     * @param {Object} newSettings - 新的设置
     */
    updateSettings(newSettings) {
        this.state.settings = {
            ...this.state.settings,
            ...newSettings
        };
        
        // 保存设置到本地存储
        this.storageManager.saveSettings(this.state.settings);
    }
    
    /**
     * 获取默认设置
     * @returns {Object} 默认设置
     */
    getDefaultSettings() {
        return {
            outputFormat: 'original',
            quality: 80,
            width: null,
            height: null,
            keepMetadata: false,
            colorMode: 'rgb',
            pngCompression: 6,
            webpMode: 'lossy'
        };
    }
    
    /**
     * 加载保存的设置
     */
    loadSavedSettings() {
        const savedSettings = this.storageManager.loadSettings();
        if (savedSettings) {
            this.state.settings = {
                ...this.state.settings,
                ...savedSettings
            };
        }
    }
    
    /**
     * 应用预设
     * @param {string} presetName - 预设名称
     */
    applyPreset(presetName) {
        let preset;
        
        // 检查是否是内置预设
        switch (presetName) {
            case 'web':
                preset = {
                    outputFormat: 'webp',
                    quality: 75,
                    width: null,
                    height: null,
                    keepMetadata: false,
                    colorMode: 'rgb',
                    webpMode: 'lossy'
                };
                break;
            case 'social':
                preset = {
                    outputFormat: 'jpeg',
                    quality: 85,
                    width: 1200,
                    height: null,
                    keepMetadata: false,
                    colorMode: 'rgb'
                };
                break;
            case 'high':
                preset = {
                    outputFormat: 'original',
                    quality: 95,
                    width: null,
                    height: null,
                    keepMetadata: true,
                    colorMode: 'rgb',
                    pngCompression: 9,
                    webpMode: 'lossless'
                };
                break;
            case 'small':
                preset = {
                    outputFormat: 'webp',
                    quality: 60,
                    width: null,
                    height: null,
                    keepMetadata: false,
                    colorMode: 'rgb',
                    webpMode: 'lossy'
                };
                break;
            default:
                // 检查自定义预设
                const customPreset = this.state.presets.find(p => p.name === presetName);
                if (customPreset) {
                    preset = customPreset.settings;
                }
        }
        
        if (preset) {
            // 更新设置
            this.updateSettings(preset);
            
            // 更新UI
            this.uiManager.updateSettingsUI(preset);
            
            // 重新处理图片
            this.processCurrentImage();
            
            this.uiManager.showNotification(`已应用预设: ${presetName}`, 'success');
        }
    }
    
    /**
     * 保存预设
     * @param {string} name - 预设名称
     */
    savePreset(name) {
        const preset = {
            name: name,
            settings: { ...this.state.settings },
            created: new Date()
        };
        
        // 检查是否已存在同名预设
        const existingIndex = this.state.presets.findIndex(p => p.name === name);
        if (existingIndex !== -1) {
            // 更新现有预设
            this.state.presets[existingIndex] = preset;
        } else {
            // 添加新预设
            this.state.presets.push(preset);
        }
        
        // 保存到本地存储
        this.storageManager.savePresets(this.state.presets);
        
        this.uiManager.showNotification(`预设已保存: ${name}`, 'success');
    }
    
    /**
     * 加载预设
     * @returns {Array} 预设列表
     */
    loadPresets() {
        return this.storageManager.loadPresets() || [];
    }
    
    /**
     * 添加到历史记录
     * @param {Object} entry - 历史记录条目
     */
    addToHistory(entry) {
        // 限制历史记录数量
        if (this.state.history.length >= 20) {
            this.state.history.pop();
        }
        
        // 添加到历史记录开头
        this.state.history.unshift(entry);
        
        // 保存到本地存储
        this.storageManager.saveHistory(this.state.history);
    }
    
    /**
     * 检查浏览器支持
     */
    checkBrowserSupport() {
        const features = {
            'File API': !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
            'Canvas': !!document.createElement('canvas').getContext,
            'Web Workers': !!window.Worker,
            'IndexedDB': !!window.indexedDB
        };
        
        const unsupported = Object.entries(features)
            .filter(([, supported]) => !supported)
            .map(([feature]) => feature);
        
        if (unsupported.length > 0) {
            console.warn('浏览器不支持以下功能:', unsupported.join(', '));
            this.uiManager.showNotification(`您的浏览器不支持部分功能: ${unsupported.join(', ')}，可能影响使用体验`, 'warning');
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
    
    /**
     * 获取文件扩展名
     * @param {string} mimeType - MIME类型
     * @returns {string} 文件扩展名
     */
    getFileExtension(mimeType) {
        switch (mimeType) {
            case 'image/jpeg':
                return 'jpg';
            case 'image/png':
                return 'png';
            case 'image/webp':
                return 'webp';
            case 'image/gif':
                return 'gif';
            default:
                return 'jpg';
        }
    }
}

// 导出类以便在HTML中使用
// 注意：使用ES模块时，初始化已在HTML中处理