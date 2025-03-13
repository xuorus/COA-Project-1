# Test database connection first
Write-Host "`nTesting database connection..." -ForegroundColor Cyan
try {
    $dbTest = Invoke-RestMethod `
        -Method Get `
        -Uri "http://localhost:5000/api/scan/test-db"
    Write-Host "Database connection successful!" -ForegroundColor Green
    Write-Host "Timestamp: $($dbTest.timestamp)"
} catch {
    Write-Host "Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test document scanning
Write-Host "`nTesting document scanning..." -ForegroundColor Cyan
$scanBody = @{
    documentType = "SALN"  # or "PDS"
} | ConvertTo-Json

try {
    $scanResult = Invoke-RestMethod `
        -Method Post `
        -Uri "http://localhost:5000/api/scan/start-scan" `
        -Body $scanBody `
        -ContentType "application/json"

    if ($scanResult.success) {
        Write-Host "Scan successful!" -ForegroundColor Green
        Write-Host "Message: $($scanResult.message)"
        
        # Test document upload if scan was successful
        Write-Host "`nUploading scanned document..." -ForegroundColor Cyan
        $uploadBody = @{
            pid = 1  # Replace with actual person ID
            type = "SALN"
            data = $scanResult.output
        } | ConvertTo-Json

        $uploadResult = Invoke-RestMethod `
            -Method Post `
            -Uri "http://localhost:5000/api/scan/upload" `
            -Body $uploadBody `
            -ContentType "application/json"

        Write-Host "Upload successful!" -ForegroundColor Green
        Write-Host "Document ID: $($uploadResult.documentId)"
    } else {
        Write-Host "Scan failed: $($scanResult.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}