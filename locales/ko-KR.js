/**
 * 한국어 언어 팩 (ko-KR)
 */

export default {
    // 페이지 제목과 설명
    app: {
        title: '이미지 압축 도구',
        description: '브라우저 기반 압축, 개인정보 보호',
        metaDescription: '온라인 이미지 압축 도구 - 빠르게 이미지 크기 줄이기, 고품질 유지, JPG/PNG/WEBP 형식 지원, 완전히 브라우저 내에서 처리하여 개인정보 보호',
        metaKeywords: '이미지 압축,온라인 압축,이미지 최적화,JPG 압축,PNG 압축,WEBP 변환',
        ogTitle: 'ImageCompressor - 스마트 온라인 이미지 압축 도구',
        ogDescription: '무료 온라인 이미지 압축, 파일 크기를 최대 80%까지 줄일 수 있음, 서버 업로드 불필요, 완전히 브라우저 내에서 처리'
    },
    
    // 업로드 영역
    upload: {
        dragDrop: '여기에 이미지를 드래그 앤 드롭',
        or: '또는',
        selectFile: '파일 선택',
        supportedFormats: '지원 형식: PNG, JPEG, WebP',
        maxFileSize: '최대 파일 크기: 10MB'
    },
    
    // 설정 영역
    settings: {
        title: '압축 설정',
        outputFormat: '출력 형식',
        keepOriginal: '원본 유지',
        quality: '품질',
        resize: '크기 조정',
        width: '너비',
        height: '높이',
        reset: '재설정',
        otherOptions: '기타 옵션',
        keepMetadata: '메타데이터 유지',
        advancedOptions: '고급 옵션',
        colorMode: '색상 모드',
        rgb: 'RGB',
        grayscale: '흑백',
        pngCompression: 'PNG 압축 수준',
        webpMode: 'WebP 모드',
        lossy: '손실',
        lossless: '무손실'
    },
    
    // 프리셋
    presets: {
        title: '프리셋',
        web: '웹 최적화',
        social: '소셜 미디어',
        high: '고품질',
        small: '최소 크기',
        presetName: '프리셋 이름',
        savePreset: '현재 설정 저장'
    },
    
    // 미리보기 영역
    preview: {
        title: '미리보기 및 비교',
        original: '원본',
        compressed: '압축 후',
        sideBySide: '나란히 비교',
        sliderCompare: '슬라이더 비교',
        toggleMagnifier: '확대경',
        compressionRatio: '압축률',
        qualityScore: '품질 점수',
        download: '압축 이미지 다운로드',
        reset: '설정 재설정',
        share: '도구 공유'
    },
    
    // 일괄 처리
    batch: {
        title: '일괄 처리',
        processAll: '모두 처리',
        downloadAll: '모두 다운로드',
        downloadZip: 'ZIP으로 다운로드',
        processing: '처리 중...'
    },
    
    // 푸터
    footer: {
        copyright: '© 2025 이미지 압축 도구 | 브라우저 기반 처리, 개인정보 보호',
        about: '소개',
        help: '도움말',
        aboutUs: '회사 소개',
        privacy: '개인정보 처리방침'
    },
    
    // 소개 모달
    aboutModal: {
        title: '이미지 압축 도구 소개',
        description1: '이것은 순수 프론트엔드 이미지 압축 도구입니다. 모든 처리는 브라우저 내에서 이루어지며 서버에 업로드되지 않아 개인정보를 보호합니다.',
        description2: '여러 이미지 형식 변환 및 압축을 지원하며 직관적인 압축 효과 비교를 제공합니다.',
        version: '버전: 1.0.0'
    },
    
    // 도움말 모달
    helpModal: {
        title: '사용 방법',
        basicUsage: '기본 사용법',
        step1: '이미지를 드래그 앤 드롭하거나 "파일 선택" 버튼을 클릭하여 이미지 업로드',
        step2: '압축 설정(형식, 품질, 크기 등) 조정',
        step3: '압축 효과 미리보기',
        step4: '압축된 이미지 다운로드',
        batchProcessing: '일괄 처리',
        batchDescription: '여러 이미지를 업로드한 후 일괄 처리 영역에서 매개변수를 설정하고 모든 이미지를 처리할 수 있습니다.',
        faq: '자주 묻는 질문',
        q1: 'Q: 왜 큰 이미지 처리는 오래 걸리나요?',
        a1: 'A: 이미지 처리는 브라우저 내에서 이루어지므로 큰 이미지는 더 많은 시간이 필요할 수 있습니다.',
        q2: 'Q: 이미지가 서버에 업로드되나요?',
        a2: 'A: 아니요, 모든 처리는 브라우저 내에서 이루어집니다.'
    },
    
    // 언어 선택
    language: {
        title: '언어',
        zhCN: '简体中文',
        enUS: 'English',
        jaJP: '日本語',
        koKR: '한국어'
    },
    
    // 오류 메시지
    errors: {
        browserNotSupported: '사용 중인 브라우저는 다음 필수 기능을 지원하지 않습니다: {{features}}\\n최신 버전의 Chrome/Firefox/Edge를 사용하십시오',
        fileTooBig: '파일이 너무 큽니다. 최대 크기는 10MB입니다',
        unsupportedFormat: '지원되지 않는 파일 형식입니다. PNG, JPEG 또는 WebP 형식을 사용하십시오',
        processingFailed: '처리 실패, 다시 시도하십시오'
    }
};