param(
    [Parameter()]
    [string]$DocumentType = "Document"
)

# Constants for Canon DR-M260
$SCANNER_MODEL = "Canon DR-M260"
$DPI_SETTING = 300
$COLOR_MODE = 1  # 1 for color
$BIT_DEPTH = 24
$DUPLEX_MODE = 1 # 1 for duplex, 0 for simplex

# Check if running with admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script needs to be run as Administrator"
    exit 1
}

try {
    # Check if WIA service is running
    $wiaService = Get-Service -Name "stisvc"
    if ($wiaService.Status -ne "Running") {
        Write-Host "Starting WIA service..."
        Start-Service -Name "stisvc"
        Start-Sleep -Seconds 2
    }

    Write-Host "Checking for Canon DR-M260 scanner..."
    $deviceManager = New-Object -ComObject WIA.DeviceManager
    $devices = $deviceManager.DeviceInfos | Where-Object { $_.Type -eq 1 }
    
    if ($devices.Count -eq 0) {
        Write-Host "Available imaging devices:"
        Get-PnpDevice -Class Image | Format-Table -AutoSize
        Write-Error "No WIA-compatible scanner found. Please ensure your scanner is:"
        Write-Error "1. Properly connected via USB"
        Write-Error "2. Powered on"
        Write-Error "3. Has WIA-compatible drivers installed"
        exit 1
    }

    # Find Canon DR-M260 specifically
    $scanner = $devices | Where-Object { 
        $_.Properties('Name').Value -like "*Canon*DR-M260*" 
    } | Select-Object -First 1

    if ($null -eq $scanner) {
        Write-Error "Canon DR-M260 not found. Please ensure it's properly connected."
        exit 1
    }

    Write-Host "Found scanner: $($scanner.Properties('Name').Value)"

    # Connect to scanner
    Write-Host "Connecting to scanner..."
    $device = $scanner.Connect()
    $item = $device.Items.Item(1)

    # Configure scan settings for Canon DR-M260
    Write-Host "Configuring scan settings..."
    
    # Basic settings
    $item.Properties("6146").Value = $DPI_SETTING        # DPI
    $item.Properties("6147").Value = $COLOR_MODE         # Color mode
    $item.Properties("6148").Value = $BIT_DEPTH         # Bit depth

    # Canon-specific settings
    $item.Properties("4104").Value = $DUPLEX_MODE       # Duplex mode
    $item.Properties("3088").Value = 0                  # Auto color detection off
    $item.Properties("3091").Value = 1                  # Auto page size detection on
    
    # Additional Canon DR-M260 specific settings if needed
    $item.Properties("3092").Value = 1                  # Enable document skew correction
    $item.Properties("3093").Value = 1                  # Enable blank page removal

    # Create a timestamped filename
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $documentsPath = [Environment]::GetFolderPath("MyDocuments")
    $scanFolder = Join-Path $documentsPath "ScannedDocuments"
    
    # Create folder if it doesn't exist
    if (!(Test-Path $scanFolder)) {
        Write-Host "Creating output directory..."
        New-Item -ItemType Directory -Path $scanFolder -Force | Out-Null
    }

    $outputPath = Join-Path $scanFolder "${DocumentType}_${timestamp}.pdf"

    Write-Host "Initiating scan for $DocumentType..."
    $image = $item.Transfer()
    
    Write-Host "Saving scan to $outputPath..."
    $image.SaveFile($outputPath)

    Write-Output $outputPath

} catch {
    Write-Error "Scanning error: $($_.Exception.Message)"
    Write-Host "Detailed error information:"
    Write-Host $_.Exception
    exit 1
} finally {
    # Cleanup
    if ($null -ne $image) {
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($image)
    }
    if ($null -ne $device) {
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($device)
    }
    if ($null -ne $deviceManager) {
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($deviceManager)
    }
    [System.GC]::Collect()
}