/**
 * 国际化支持模块
 * 提供多语言支持功能
 */

export class I18nManager {
    constructor() {
        // 默认语言
        this.defaultLanguage = 'zh-CN';
        // 当前语言
        this.currentLanguage = this.detectLanguage();
        // 语言数据
        this.translations = {};
        // 已加载的语言
        this.loadedLanguages = [];
    }

    /**
     * 检测用户语言
     * @returns {string} 语言代码
     */
    detectLanguage() {
        // 优先从localStorage获取用户设置的语言
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage) {
            return savedLanguage;
        }
        
        // 从浏览器获取语言设置
        const browserLang = navigator.language || navigator.userLanguage;
        // 目前支持的语言列表
        const supportedLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];
        
        // 检查是否支持浏览器语言
        const langCode = browserLang.split('-')[0];
        for (const supported of supportedLanguages) {
            if (supported.startsWith(langCode)) {
                return supported;
            }
        }
        
        // 默认返回中文
        return this.defaultLanguage;
    }

    /**
     * 加载语言文件
     * @param {string} lang 语言代码
     * @returns {Promise} 加载完成的Promise
     */
    async loadLanguage(lang) {
        // 如果已经加载过该语言，则直接返回
        if (this.loadedLanguages.includes(lang)) {
            return Promise.resolve();
        }
        
        try {
            // 动态导入语言文件
            const module = await import(`/locales/${lang}.js`);
            this.translations[lang] = module.default;
            this.loadedLanguages.push(lang);
            return Promise.resolve();
        } catch (error) {
            console.error(`加载语言文件失败: ${lang}`, error);
            // 如果加载失败且不是默认语言，则尝试加载默认语言
            if (lang !== this.defaultLanguage) {
                return this.loadLanguage(this.defaultLanguage);
            }
            return Promise.reject(error);
        }
    }

    /**
     * 切换语言
     * @param {string} lang 目标语言代码
     * @returns {Promise} 切换完成的Promise
     */
    async changeLanguage(lang) {
        // 加载语言文件
        await this.loadLanguage(lang);
        
        // 更新当前语言
        this.currentLanguage = lang;
        
        // 保存用户语言偏好
        localStorage.setItem('app_language', lang);
        
        // 更新页面上的所有文本
        this.updatePageText();
        
        // 更新HTML lang属性
        document.documentElement.lang = lang;
        
        // 触发语言变更事件
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        
        return Promise.resolve();
    }

    /**
     * 获取翻译文本
     * @param {string} key 翻译键
     * @param {Object} params 替换参数
     * @returns {string} 翻译后的文本
     */
    t(key, params = {}) {
        // 获取当前语言的翻译
        const translations = this.translations[this.currentLanguage] || {};
        
        // 按照点号分割键，支持嵌套对象
        const keys = key.split('.');
        let value = translations;
        
        // 遍历键路径
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // 如果找不到翻译，尝试从默认语言获取
                if (this.currentLanguage !== this.defaultLanguage) {
                    const defaultTranslations = this.translations[this.defaultLanguage] || {};
                    let defaultValue = defaultTranslations;
                    for (const dk of keys) {
                        if (defaultValue && typeof defaultValue === 'object' && dk in defaultValue) {
                            defaultValue = defaultValue[dk];
                        } else {
                            return key; // 如果默认语言也没有，则返回键名
                        }
                    }
                    value = defaultValue;
                } else {
                    return key; // 如果是默认语言且找不到，则返回键名
                }
            }
        }
        
        // 如果值不是字符串，则返回键名
        if (typeof value !== 'string') {
            return key;
        }
        
        // 替换参数
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
            return params[paramKey] !== undefined ? params[paramKey] : match;
        });
    }

    /**
     * 更新页面上的所有带有data-i18n属性的元素文本
     */
    updatePageText() {
        // 查找所有带有data-i18n属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            // 获取翻译文本
            const text = this.t(key);
            
            // 根据元素类型设置文本
            if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'password' || el.type === 'email')) {
                // 对于输入框，设置placeholder
                if (el.hasAttribute('data-i18n-placeholder')) {
                    el.placeholder = text;
                } else {
                    el.value = text;
                }
            } else if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
                // 对于按钮输入框，设置value
                el.value = text;
            } else if (el.tagName === 'IMG') {
                // 对于图片，设置alt属性
                el.alt = text;
            } else if (el.tagName === 'META') {
                // 对于meta标签，设置content属性
                el.content = text;
            } else if (el.hasAttribute('data-i18n-attr')) {
                // 如果指定了特定属性，则设置该属性
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, text);
            } else {
                // 默认设置innerText
                el.innerText = text;
            }
        });
        
        // 更新页面标题
        const titleKey = document.querySelector('title').getAttribute('data-i18n');
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }

    /**
     * 获取支持的语言列表
     * @returns {Array} 语言列表
     */
    getSupportedLanguages() {
        return [
            { code: 'zh-CN', name: '简体中文' },
            { code: 'en-US', name: 'English' },
            { code: 'ja-JP', name: '日本語' },
            { code: 'ko-KR', name: '한국어' }
        ];
    }
}

// 创建单例实例
export const i18n = new I18nManager();

// 添加全局访问方法
window.t = (key, params) => i18n.t(key, params);