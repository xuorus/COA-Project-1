# Constants for WIA
$WIA_IMG_FORMAT_PNG = "{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}"

# Scanner settings
$scannerSettings = @{
    Model = "Canon DR-M260"
    DPI = 300
    ColorMode = 1    # 1=Color, 0=BW
    BitDepth = 24
    Duplex = 1      # 1=Duplex, 0=Simplex
}

function Test-AdminPrivileges {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-AdminPrivileges)) {
    Start-Process powershell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

function Initialize-Scanner {
    try {
        Write-Host "Initializing scanner..." -ForegroundColor Cyan
        
        # Check WIA Service
        $wiaService = Get-Service -Name "stisvc"
        if ($wiaService.Status -ne "Running") {
            Write-Host "Starting WIA Service..." -ForegroundColor Yellow
            Start-Service -Name "stisvc" -ErrorAction Stop
            Start-Sleep -Seconds 2
        }

        $deviceManager = New-Object -ComObject WIA.DeviceManager
        $devices = $deviceManager.DeviceInfos | Where-Object { $_.Type -eq 1 }
        
        Write-Host "Searching for available scanners..." -ForegroundColor Cyan
        $scanner = $devices | Select-Object -First 1

        if ($null -eq $scanner) {
            Write-Host "`nScanner not found. Please check:" -ForegroundColor Red
            Write-Host "1. Scanner is powered on" -ForegroundColor Yellow
            Write-Host "2. USB cable is connected" -ForegroundColor Yellow
            Write-Host "3. Scanner driver is installed" -ForegroundColor Yellow
            return $null
        }

        Write-Host "`nConnecting to scanner..." -ForegroundColor Cyan
        $device = $scanner.Connect()
        
        if ($null -eq $device) {
            throw "Failed to connect to scanner"
        }

        Write-Host "Scanner connected successfully!" -ForegroundColor Green
        return $device
    }
    catch {
        Write-Host "`nError initializing scanner: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Check-FileFormat {
    param (
        [string]$filePath,
        [string]$expectedFormat = "png"
    )

    $fileExtension = [System.IO.Path]::GetExtension($filePath).TrimStart('.').ToLower()
    return $fileExtension -eq $expectedFormat
}

function Start-DocumentScan {
    param (
        [string]$outputPath,
        [ValidateSet('PDS', 'SALN', 'Other')]
        [string]$documentType = "Other"
    )

    $device = $null
    $image = $null
    $tempFiles = @()
    $tempDir = Join-Path $env:TEMP "ScanTemp"

    try {
        # Initialize scanner
        $device = Initialize-Scanner
        if ($null -eq $device) { return $null }

        Write-Host "`nConfiguring scanner settings..." -ForegroundColor Cyan
        $item = $device.Items.Item(1)

        try {
            $item.Properties("6146").Value = [int]$scannerSettings.DPI
            $item.Properties("6147").Value = [int]$scannerSettings.ColorMode
            $item.Properties("6148").Value = [int]$scannerSettings.BitDepth
            $item.Properties("4104").Value = [int]$scannerSettings.Duplex
            $item.Properties("3095").Value = [int]1  # Auto-orientation
            $item.Properties("3091").Value = [int]1  # Auto-size
            $item.Properties("3092").Value = [int]1  # Deskew
            $item.Properties("3093").Value = [int]1  # Blank page removal
        }
        catch {
            Write-Host "Warning: Using default scanner properties" -ForegroundColor Yellow
        }

        # Create temp directory
        if (!(Test-Path $tempDir)) {
            New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        }

        Write-Host "`nMulti-Page Scanning Mode" -ForegroundColor Cyan
        Write-Host "----------------------" -ForegroundColor Cyan
        Write-Host "Scanning all pages..." -ForegroundColor Yellow

        # Scan pages
        $pageCount = 0
        do {
            try {
                Write-Host "Scanning page $($pageCount + 1)..." -ForegroundColor Cyan
                $image = $item.Transfer()
                
                if ($image) {
                    $pageCount++
                    $tempFile = Join-Path $tempDir "scan_page_$pageCount.png"
                    $tempFiles += $tempFile
                    
                    # Save as PNG for better quality
                    $imageProcess = New-Object -ComObject WIA.ImageProcess
                    $imageProcess.Filters.Add($imageProcess.FilterInfos.Item("Convert").FilterID)
                    $imageProcess.Filters.Item(1).Properties.Item("FormatID").Value = $WIA_IMG_FORMAT_PNG
                    $convertedImage = $imageProcess.Apply($image)
                    $convertedImage.SaveFile($tempFile)
                    
                    Write-Host "Page $pageCount scanned successfully" -ForegroundColor Green
                    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($image)
                    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($convertedImage)
                    $image = $null
                }
                Start-Sleep -Milliseconds 500
            }
            catch [System.Runtime.InteropServices.COMException] {
                break
            }
        } while ($true)

        if ($pageCount -eq 0) {
            throw "No pages were scanned"
        }

        Write-Host "`nTotal pages scanned: $pageCount" -ForegroundColor Cyan

        # Ensure output directory exists
        if (!(Test-Path $outputPath)) {
            New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
        }

        # Check file formats
        foreach ($tempFile in $tempFiles) {
            if (-not (Check-FileFormat -filePath $tempFile -expectedFormat "png")) {
                Write-Host "Error: File $tempFile is not in PNG format" -ForegroundColor Red
                return $null
            }
        }

        # Create PDF
        Write-Host "Creating PDF document..." -ForegroundColor Cyan
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $fileName = "${documentType}_${timestamp}.pdf"
        $fullPath = Join-Path $outputPath $fileName

        try {
            Add-Type -AssemblyName System.Drawing

            # Configure print settings
            $doc = New-Object System.Drawing.Printing.PrintDocument
            $doc.PrinterSettings.PrintToFile = $true
            $doc.PrinterSettings.PrintFileName = $fullPath
            
            # Set page settings
            $doc.DefaultPageSettings.Margins = New-Object System.Drawing.Printing.Margins(0, 0, 0, 0)
            $doc.DefaultPageSettings.Color = $true

            # Load images with standard resolution
            $pages = @()
            foreach ($tempFile in $tempFiles) {
                $img = [System.Drawing.Image]::FromFile($tempFile)
                $bitmap = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
                $bitmap.SetResolution(300, 300)  # Match scanner DPI
                $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)
                $pages += $bitmap
                $graphics.Dispose()
                $img.Dispose()
            }

            # Print handler
            $script:pageIndex = 0
            $doc.add_PrintPage({
                param($sender, $e)
                
                if ($script:pageIndex -lt $pages.Count) {
                    $img = $pages[$script:pageIndex]
                    
                    # Set paper size to match image
                    $width = [int]($img.Width * 100 / 300)   # Convert pixels to hundredths of an inch
                    $height = [int]($img.Height * 100 / 300)
                    $doc.DefaultPageSettings.PaperSize = New-Object System.Drawing.Printing.PaperSize("Custom", $width, $height)
                    
                    # Draw image
                    $e.Graphics.DrawImage($img, 0, 0)
                    $script:pageIndex++
                    $e.HasMorePages = ($script:pageIndex -lt $pages.Count)
                }
            })

            # Print to PDF
            $doc.Print()
            $doc.Dispose()

            # Clean up images
            foreach ($img in $pages) {
                $img.Dispose()
            }

            Write-Host "`nPDF document saved successfully to:" -ForegroundColor Green
            Write-Host $fullPath -ForegroundColor White
            return $fullPath
        }
        catch {
            Write-Host "Error creating PDF: $($_.Exception.Message)" -ForegroundColor Red
            throw
        }
    }
    catch {
        Write-Host "`nScanning error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Error details: $_" -ForegroundColor Red
        return $null
    }
    finally {
        # Clean up COM objects
        if ($null -ne $image) {
            [System.Runtime.Interopservices.Marshal]::ReleaseComObject($image)
        }
        if ($null -ne $device) {
            [System.Runtime.Interopservices.Marshal]::ReleaseComObject($device)
        }
        [System.GC]::Collect()

        # Clean up temp files
        if ($tempFiles) {
            Remove-Item -Path $tempFiles -Force -ErrorAction SilentlyContinue
        }
        if (Test-Path $tempDir) {
            Remove-Item -Path $tempDir -Force -Recurse -ErrorAction SilentlyContinue
        }
    }
}

# Create output directory
$outputDir = Join-Path $env:USERPROFILE "Documents\ScannedDocuments"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Automatically scan PDS document
$result = Start-DocumentScan -outputPath $outputDir -documentType "PDS"

if ($result) {
    Write-Host "`nScan completed successfully!" -ForegroundColor Green

    # Open the output directory
    Write-Host "Opening scanned documents folder..." -ForegroundColor Cyan
    Start-Process -FilePath $outputDir
}

Write-Host "`nProcess complete!" -ForegroundColor Green