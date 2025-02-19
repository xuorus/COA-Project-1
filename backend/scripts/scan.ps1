$deviceManager = New-Object -ComObject WIA.DeviceManager
$scanner = $deviceManager.DeviceInfos | Where-Object { $_.Type -eq 1 } | Select-Object -First 1
$device = $scanner.Connect()
$item = $device.Items.Item(1)

$outputFile = "C:\ScannedDocuments\scanned_image.jpg"
$item.Transfer().SaveFile($outputFile)

Write-Output "Scanned document saved at $outputFile"