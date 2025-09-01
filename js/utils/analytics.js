// Google Analytics 工具类
class Analytics {
    constructor() {
        this.initialized = false;
        this.GA_MEASUREMENT_ID = 'G-SVTJJQ3G6E';
    }

    init() {
        if (this.initialized) return;
        
        // 加载 Google Analytics 脚本
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.GA_MEASUREMENT_ID);
        
        this.initialized = true;
    }

    trackEvent(category, action, label, value) {
        if (!this.initialized) this.init();
        
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }

    trackPageView(path) {
        if (!this.initialized) this.init();
        
        gtag('config', this.GA_MEASUREMENT_ID, {
            'page_path': path
        });
    }
}

// 导出单例实例
export const analytics = new Analytics();