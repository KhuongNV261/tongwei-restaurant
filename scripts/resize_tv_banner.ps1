Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Khuongnv\Downloads\TV TONG WEI 11 10.png"
$destPath = "assets\images\branding\tv_tongwei_nguyen_thi_thap.jpg"
$destThumb = "assets\images\branding\tv_banner_thumb.jpg"

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
Write-Output "Original: $($srcImg.Width) x $($srcImg.Height)"

# Resize to 1920 width, keeping aspect ratio
$targetWidth = 1920
$targetHeight = [int]($srcImg.Height * ($targetWidth / $srcImg.Width))

$bitmap = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$rect = New-Object System.Drawing.Rectangle 0, 0, $targetWidth, $targetHeight
$graphics.DrawImage($srcImg, $rect)

# Save as JPEG with 85 quality
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]85)

$bitmap.Save($destPath, $codec, $encoderParams)
Write-Output "Saved 1920x$targetHeight to $destPath"

$graphics.Dispose()
$bitmap.Dispose()
$srcImg.Dispose()
