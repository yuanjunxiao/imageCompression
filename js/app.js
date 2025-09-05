    /**
     * 初始化水印设置事件监听
     */
    initWatermarkListeners() {
        const watermarkEnabled = document.getElementById('watermarkEnabled');
        const watermarkText = document.getElementById('watermarkText');
        const watermarkFontSize = document.getElementById('watermarkFontSize');
        const watermarkColor = document.getElementById('watermarkColor');
        const watermarkOpacity = document.getElementById('watermarkOpacity');
        const watermarkPosition = document.getElementById('watermarkPosition');
        
        if (!watermarkEnabled || !watermarkText || !watermarkFontSize || 
            !watermarkColor || !watermarkOpacity || !watermarkPosition) {
            console.error('无法找到水印设置元素');
            return;
        }
        
        watermarkEnabled.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    enabled: watermarkEnabled.checked
                }
            });
            this.processCurrentImage();
        });
        
        watermarkText.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    text: watermarkText.value
                }
            });
            this.processCurrentImage();
        });
        
        watermarkFontSize.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    fontSize: parseInt(watermarkFontSize.value)
                }
            });
            this.processCurrentImage();
        });
        
        watermarkColor.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    color: watermarkColor.value
                }
            });
            this.processCurrentImage();
        });
        
        watermarkOpacity.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    opacity: parseFloat(watermarkOpacity.value)
                }
            });
            this.processCurrentImage();
        });
        
        watermarkPosition.addEventListener('change', () => {
            this.updateSettings({
                watermark: {
                    ...this.state.settings.watermark,
                    position: watermarkPosition.value
                }
            });
            this.processCurrentImage();
        });
    }