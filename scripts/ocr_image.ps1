[Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$imagePath = (Resolve-Path "assets\images\branding\tv_tongwei_nguyen_thi_thap.jpg").Path
$file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath).GetAwaiter().GetResult()
$stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
$decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
$bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()

$lang = New-Object Windows.Globalization.Language("vi")
if (-not [Windows.Media.Ocr.OcrEngine]::IsLanguageSupported($lang)) {
    $lang = New-Object Windows.Globalization.Language("en-US")
}

$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if ($ocrEngine -eq $null) {
    $ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}

$ocrResult = $ocrEngine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
Write-Output "--- OCR EXTRACTED TEXT ---"
Write-Output $ocrResult.Text
