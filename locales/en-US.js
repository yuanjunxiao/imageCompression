/**
 * English language pack (en-US)
 */

export default {
    // Page title and description
    app: {
        title: 'Image Compression Tool',
        description: 'Browser-based compression, protecting your privacy',
        metaDescription: 'Online image compression tool - Quickly reduce image size while maintaining quality, supports JPG/PNG/WEBP formats, processed entirely in your browser to protect your privacy',
        metaKeywords: 'image compression,online compression,image optimization,JPG compression,PNG compression,WEBP conversion',
        ogTitle: 'ImageCompressor - Smart Online Image Compression Tool',
        ogDescription: 'Free online image compression, reduce file size by up to 80%, no server upload required, processed entirely in your browser'
    },
    
    // Upload area
    upload: {
        dragDrop: 'Drag and drop images here',
        or: 'or',
        selectFile: 'Select Files',
        supportedFormats: 'Supported formats: PNG, JPEG, WebP',
        maxFileSize: 'Maximum file size: 10MB'
    },
    
    // Settings area
    settings: {
        title: 'Compression Settings',
        outputFormat: 'Output Format',
        keepOriginal: 'Keep Original',
        quality: 'Quality',
        resize: 'Resize',
        width: 'Width',
        height: 'Height',
        reset: 'Reset',
        otherOptions: 'Other Options',
        keepMetadata: 'Keep Metadata',
        advancedOptions: 'Advanced Options',
        colorMode: 'Color Mode',
        rgb: 'RGB',
        grayscale: 'Grayscale',
        pngCompression: 'PNG Compression Level',
        webpMode: 'WebP Mode',
        lossy: 'Lossy',
        lossless: 'Lossless'
    },
    
    // Presets
    presets: {
        title: 'Presets',
        web: 'Web Optimization',
        social: 'Social Media',
        high: 'High Quality',
        small: 'Smallest Size',
        presetName: 'Preset Name',
        savePreset: 'Save Current Settings'
    },
    
    // Preview area
    preview: {
        title: 'Preview & Compare',
        original: 'Original',
        compressed: 'Compressed',
        sideBySide: 'Side by Side',
        sliderCompare: 'Slider Compare',
        toggleMagnifier: 'Magnifier',
        compressionRatio: 'Compression Ratio',
        qualityScore: 'Quality Score',
        download: 'Download Compressed Image',
        reset: 'Reset Settings',
        share: 'Share Tool'
    },
    
    // Batch processing
    batch: {
        title: 'Batch Processing',
        processAll: 'Process All',
        downloadAll: 'Download All',
        downloadZip: 'Download as ZIP',
        processing: 'Processing...'
    },
    
    // Footer
    footer: {
        copyright: '© 2025 Image Compression Tool | Browser-based processing, protecting your privacy',
        about: 'About',
        help: 'Help',
        aboutUs: 'About Us',
        privacy: 'Privacy Policy'
    },
    
    // About modal
    aboutModal: {
        title: 'About Image Compression Tool',
        description1: 'This is a pure frontend image compression tool. All processing is done in your browser without uploading to any server, protecting your privacy.',
        description2: 'Supports multiple image format conversion and compression, providing intuitive compression effect comparison.',
        version: 'Version: 1.0.0'
    },
    
    // Help modal
    helpModal: {
        title: 'Usage Help',
        basicUsage: 'Basic Usage',
        step1: 'Drag and drop images or click "Select Files" button to upload images',
        step2: 'Adjust compression settings (format, quality, size, etc.)',
        step3: 'Preview compression effect',
        step4: 'Download compressed images',
        batchProcessing: 'Batch Processing',
        batchDescription: 'After uploading multiple images, you can set parameters and process all images in the batch processing area.',
        faq: 'FAQ',
        q1: 'Q: Why does processing large images take so long?',
        a1: 'A: Image processing is done in your browser, large images may require more time.',
        q2: 'Q: Are my images uploaded to a server?',
        a2: 'A: No, all processing is done in your browser.'
    },
    
    // Language selection
    language: {
        title: 'Language',
        zhCN: '简体中文',
        enUS: 'English',
        jaJP: '日本語',
        koKR: '한국어'
    },
    
    // Error messages
    errors: {
        browserNotSupported: 'Your browser does not support the following required features: {{features}}\\nPlease use the latest version of Chrome/Firefox/Edge',
        fileTooBig: 'File is too large, maximum size is 10MB',
        unsupportedFormat: 'Unsupported file format, please use PNG, JPEG or WebP format',
        processingFailed: 'Processing failed, please try again'
    }
};