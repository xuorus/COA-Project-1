$deviceManager = New-Object -ComObject WIA.DeviceManager
$scanner = $deviceManager.DeviceInfos | Where-Object { $_.Type -eq 1 } | Select-Object -First 1

if ($null -eq $scanner) {
    Write-Output "No scanner detected. Please check your connection."
    exit
}

$device = $scanner.Connect()
$item = $device.Items.Item(1)

# Get the Desktop path dynamically
$desktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "scanned_image.jpg")

$item.Transfer().SaveFile($desktopPath)

Write-Output "Scanned document saved at $desktopPath"                                                                                                                                                                                               