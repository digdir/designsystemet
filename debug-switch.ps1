function Convert-ToKebabCase {
    param([string]$Text)
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    return $result.ToLower()
}

$Directory = "c:\kode\designsystemet\packages\react\src\components\switch"
Write-Host "Processing directory: $Directory"

$files = Get-ChildItem -Path $Directory -File | Where-Object { 
    $_.Name -notlike "index.*" -and 
    $_.Name -notlike "*.json" -and
    $_.Name -notlike "*.html" -and
    $_.Name -notlike "README.md"
}

Write-Host "Files found:"
foreach ($file in $files) {
    $oldName = $file.Name
    $nameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($oldName)
    $extension = $file.Extension
    $newNameWithoutExtension = Convert-ToKebabCase $nameWithoutExtension
    $newName = "$newNameWithoutExtension$extension"
    
    Write-Host "  File: $oldName"
    Write-Host "    Name without ext: $nameWithoutExtension"
    Write-Host "    Converted: $newNameWithoutExtension"
    Write-Host "    New name: $newName"
    Write-Host "    Same? $($oldName -eq $newName)"
    Write-Host ""
}
