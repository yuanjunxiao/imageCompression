/**
 * 日本語言語パック (ja-JP)
 */

export default {
    // ページタイトルと説明
    app: {
        title: '画像圧縮ツール',
        description: 'ブラウザベースの圧縮、プライバシーを保護',
        metaDescription: 'オンライン画像圧縮ツール - 高品質を維持しながら画像サイズを素早く縮小、JPG/PNG/WEBP形式をサポート、完全にブラウザ内で処理してプライバシーを保護',
        metaKeywords: '画像圧縮,オンライン圧縮,画像最適化,JPG圧縮,PNG圧縮,WEBP変換',
        ogTitle: 'ImageCompressor - スマートオンライン画像圧縮ツール',
        ogDescription: '無料オンライン画像圧縮、ファイルサイズを最大80%削減、サーバーへのアップロードは不要、完全にブラウザ内で処理'
    },
    
    // アップロードエリア
    upload: {
        dragDrop: 'ここに画像をドラッグ＆ドロップ',
        or: 'または',
        selectFile: 'ファイルを選択',
        supportedFormats: '対応フォーマット: PNG, JPEG, WebP',
        maxFileSize: '最大ファイルサイズ: 10MB'
    },
    
    // 設定エリア
    settings: {
        title: '圧縮設定',
        outputFormat: '出力フォーマット',
        keepOriginal: '元のフォーマットを維持',
        quality: '品質',
        resize: 'サイズ変更',
        width: '幅',
        height: '高さ',
        reset: 'リセット',
        otherOptions: 'その他のオプション',
        keepMetadata: 'メタデータを保持',
        advancedOptions: '詳細オプション',
        colorMode: 'カラーモード',
        rgb: 'RGB',
        grayscale: 'グレースケール',
        pngCompression: 'PNG圧縮レベル',
        webpMode: 'WebPモード',
        lossy: '非可逆圧縮',
        lossless: '可逆圧縮'
    },
    
    // プリセット
    presets: {
        title: 'プリセット',
        web: 'ウェブ最適化',
        social: 'ソーシャルメディア',
        high: '高品質',
        small: '最小サイズ',
        presetName: 'プリセット名',
        savePreset: '現在の設定を保存'
    },
    
    // プレビューエリア
    preview: {
        title: 'プレビューと比較',
        original: '元の画像',
        compressed: '圧縮後',
        sideBySide: '並べて比較',
        sliderCompare: 'スライダー比較',
        toggleMagnifier: '拡大鏡',
        compressionRatio: '圧縮率',
        qualityScore: '品質スコア',
        download: '圧縮画像をダウンロード',
        reset: '設定をリセット',
        share: 'ツールを共有'
    },
    
    // バッチ処理
    batch: {
        title: 'バッチ処理',
        processAll: 'すべて処理',
        downloadAll: 'すべてダウンロード',
        downloadZip: 'ZIPでダウンロード',
        processing: '処理中...'
    },
    
    // フッター
    footer: {
        copyright: '© 2025 画像圧縮ツール | ブラウザベースの処理、プライバシーを保護',
        about: '概要',
        help: 'ヘルプ',
        aboutUs: '私たちについて',
        privacy: 'プライバシーポリシー'
    },
    
    // 概要モーダル
    aboutModal: {
        title: '画像圧縮ツールについて',
        description1: 'これは純粋なフロントエンド画像圧縮ツールです。すべての処理はブラウザ内で行われ、サーバーにアップロードされることはなく、プライバシーを保護します。',
        description2: '複数の画像フォーマット変換と圧縮をサポートし、直感的な圧縮効果の比較を提供します。',
        version: 'バージョン: 1.0.0'
    },
    
    // ヘルプモーダル
    helpModal: {
        title: '使用方法',
        basicUsage: '基本的な使用方法',
        step1: '画像をドラッグ＆ドロップするか、「ファイルを選択」ボタンをクリックして画像をアップロード',
        step2: '圧縮設定（フォーマット、品質、サイズなど）を調整',
        step3: '圧縮効果をプレビュー',
        step4: '圧縮された画像をダウンロード',
        batchProcessing: 'バッチ処理',
        batchDescription: '複数の画像をアップロードした後、バッチ処理エリアでパラメータを設定し、すべての画像を処理できます。',
        faq: 'よくある質問',
        q1: 'Q: なぜ大きな画像の処理に時間がかかるのですか？',
        a1: 'A: 画像処理はブラウザ内で行われるため、大きな画像はより多くの時間が必要になることがあります。',
        q2: 'Q: 画像はサーバーにアップロードされますか？',
        a2: 'A: いいえ、すべての処理はブラウザ内で行われます。'
    },
    
    // 言語選択
    language: {
        title: '言語',
        zhCN: '简体中文',
        enUS: 'English',
        jaJP: '日本語',
        koKR: '한국어'
    },
    
    // エラーメッセージ
    errors: {
        browserNotSupported: 'お使いのブラウザは次の必要な機能をサポートしていません: {{features}}\\n最新のChrome/Firefox/Edgeをご使用ください',
        fileTooBig: 'ファイルが大きすぎます。最大サイズは10MBです',
        unsupportedFormat: 'サポートされていないファイル形式です。PNG、JPEG、またはWebP形式を使用してください',
        processingFailed: '処理に失敗しました。もう一度お試しください'
    }
};