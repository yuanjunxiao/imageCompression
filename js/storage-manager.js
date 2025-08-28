/**
 * 存储管理模块
 * 负责处理本地存储、历史记录和预设管理
 */

export class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        
        // 存储键名
        this.keys = {
            settings: 'image_compressor_settings',
            presets: 'image_compressor_presets',
            history: 'image_compressor_history'
        };
        
        console.log('存储管理器初始化，本地存储可用:', this.storageAvailable);
    }
    
    /**
     * 检查存储可用性
     * @returns {boolean} 存储是否可用
     */
    checkStorageAvailability() {
        try {
            const storage = window.localStorage;
            const testKey = '__storage_test__';
            storage.setItem(testKey, testKey);
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('本地存储不可用:', e);
            return false;
        }
    }
    
    /**
     * 保存设置
     * @param {Object} settings - 设置对象
     * @returns {boolean} 是否保存成功
     */
    saveSettings(settings) {
        if (!this.storageAvailable) return false;
        
        try {
            localStorage.setItem(this.keys.settings, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('保存设置失败:', e);
            return false;
        }
    }
    
    /**
     * 加载设置
     * @returns {Object|null} 设置对象或null
     */
    loadSettings() {
        if (!this.storageAvailable) return null;
        
        try {
            const settings = localStorage.getItem(this.keys.settings);
            return settings ? JSON.parse(settings) : null;
        } catch (e) {
            console.error('加载设置失败:', e);
            return null;
        }
    }
    
    /**
     * 保存预设
     * @param {Array} presets - 预设数组
     * @returns {boolean} 是否保存成功
     */
    savePresets(presets) {
        if (!this.storageAvailable) return false;
        
        try {
            localStorage.setItem(this.keys.presets, JSON.stringify(presets));
            return true;
        } catch (e) {
            console.error('保存预设失败:', e);
            return false;
        }
    }
    
    /**
     * 加载预设
     * @returns {Array|null} 预设数组或null
     */
    loadPresets() {
        if (!this.storageAvailable) return null;
        
        try {
            const presets = localStorage.getItem(this.keys.presets);
            return presets ? JSON.parse(presets) : [];
        } catch (e) {
            console.error('加载预设失败:', e);
            return [];
        }
    }
    
    /**
     * 保存历史记录
     * @param {Array} history - 历史记录数组
     * @returns {boolean} 是否保存成功
     */
    saveHistory(history) {
        if (!this.storageAvailable) return false;
        
        try {
            // 只保存必要的信息，不保存文件数据
            const simplifiedHistory = history.map(entry => ({
                originalFileName: entry.originalFile.name,
                originalFileSize: entry.originalFile.size,
                originalFileType: entry.originalFile.type,
                compressedFileSize: entry.compressedFile ? entry.compressedFile.size : null,
                compressedFileType: entry.compressedFile ? entry.compressedFile.type : null,
                settings: entry.settings,
                timestamp: entry.timestamp
            }));
            
            localStorage.setItem(this.keys.history, JSON.stringify(simplifiedHistory));
            return true;
        } catch (e) {
            console.error('保存历史记录失败:', e);
            return false;
        }
    }
    
    /**
     * 加载历史记录
     * @returns {Array|null} 历史记录数组或null
     */
    loadHistory() {
        if (!this.storageAvailable) return null;
        
        try {
            const history = localStorage.getItem(this.keys.history);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('加载历史记录失败:', e);
            return [];
        }
    }
    
    /**
     * 清除历史记录
     * @returns {boolean} 是否清除成功
     */
    clearHistory() {
        if (!this.storageAvailable) return false;
        
        try {
            localStorage.removeItem(this.keys.history);
            return true;
        } catch (e) {
            console.error('清除历史记录失败:', e);
            return false;
        }
    }
    
    /**
     * 删除预设
     * @param {string} presetName - 预设名称
     * @returns {boolean} 是否删除成功
     */
    deletePreset(presetName) {
        if (!this.storageAvailable) return false;
        
        try {
            const presets = this.loadPresets();
            if (!presets) return false;
            
            const filteredPresets = presets.filter(preset => preset.name !== presetName);
            return this.savePresets(filteredPresets);
        } catch (e) {
            console.error('删除预设失败:', e);
            return false;
        }
    }
    
    /**
     * 重命名预设
     * @param {string} oldName - 旧名称
     * @param {string} newName - 新名称
     * @returns {boolean} 是否重命名成功
     */
    renamePreset(oldName, newName) {
        if (!this.storageAvailable) return false;
        
        try {
            const presets = this.loadPresets();
            if (!presets) return false;
            
            const preset = presets.find(p => p.name === oldName);
            if (!preset) return false;
            
            preset.name = newName;
            return this.savePresets(presets);
        } catch (e) {
            console.error('重命名预设失败:', e);
            return false;
        }
    }
    
    /**
     * 导出所有数据
     * @returns {Object|null} 导出的数据对象或null
     */
    exportData() {
        if (!this.storageAvailable) return null;
        
        try {
            return {
                settings: this.loadSettings(),
                presets: this.loadPresets(),
                history: this.loadHistory(),
                exportDate: new Date()
            };
        } catch (e) {
            console.error('导出数据失败:', e);
            return null;
        }
    }
    
    /**
     * 导入数据
     * @param {Object} data - 导入的数据对象
     * @returns {boolean} 是否导入成功
     */
    importData(data) {
        if (!this.storageAvailable) return false;
        
        try {
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            if (data.presets) {
                this.savePresets(data.presets);
            }
            
            if (data.history) {
                this.saveHistory(data.history);
            }
            
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }
    
    /**
     * 清除所有数据
     * @returns {boolean} 是否清除成功
     */
    clearAllData() {
        if (!this.storageAvailable) return false;
        
        try {
            localStorage.removeItem(this.keys.settings);
            localStorage.removeItem(this.keys.presets);
            localStorage.removeItem(this.keys.history);
            return true;
        } catch (e) {
            console.error('清除所有数据失败:', e);
            return false;
        }
    }
}