$Directory = "c:\kode\designsystemet\packages\react\src\components\switch"
Write-Host "Processing directory: $Directory"

$files = Get-ChildItem -Path $Directory -File | Where-Object { 
    ($_.Name -like "*.tsx" -or $_.Name -like "*.ts" -or $_.Name -like "*.mdx" -or $_.Name -like "*.stories.tsx" -or $_.Name -like "*.test.tsx" -or $_.Name -like "*.chromatic.tsx") -and
    $_.Name -notlike "index.*" -and 
    $_.Name -notlike "*-*" -and  # Skip files that already have hyphens
    $_.Name -cmatch '^[A-Z]'  # Only files starting with uppercase
}

Write-Host "Files found matching criteria:"
foreach ($file in $files) {
    Write-Host "  $($file.Name)"
}

Write-Host "`nAll files in directory:"
$allFiles = Get-ChildItem -Path $Directory -File
foreach ($file in $allFiles) {
    $hasHyphen = $file.Name -like "*-*"
    $startsUpper = $file.Name -cmatch '^[A-Z]'
    $isIndex = $file.Name -like "index.*"
    Write-Host "  $($file.Name) - HasHyphen: $hasHyphen, StartsUpper: $startsUpper, IsIndex: $isIndex"
}
