$oldName = "Button.tsx"
$nameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($oldName)
$extension = [System.IO.Path]::GetExtension($oldName)

Write-Host "Old name: '$oldName'"
Write-Host "Name without ext: '$nameWithoutExtension'"
Write-Host "Extension: '$extension'"

function Convert-ToKebabCase {
    param([string]$Text)
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    return $result.ToLower()
}

$newNameWithoutExtension = Convert-ToKebabCase $nameWithoutExtension
$newName = "$newNameWithoutExtension$extension"

Write-Host "New name without ext: '$newNameWithoutExtension'"
Write-Host "New name: '$newName'"
Write-Host "Equal? $($oldName -eq $newName)"
Write-Host "Not equal? $($oldName -ne $newName)"
Write-Host "Case sensitive equal? $($oldName -ceq $newName)"
Write-Host "Case sensitive not equal? $($oldName -cne $newName)"
