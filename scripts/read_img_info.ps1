Add-Type -AssemblyName System.Drawing
$filePath = "C:\Users\Khuongnv\Downloads\TV TONG WEI 11 10.png"
$img = [System.Drawing.Image]::FromFile($filePath)
Write-Output "Image width: $($img.Width), height: $($img.Height)"
$img.Dispose()
