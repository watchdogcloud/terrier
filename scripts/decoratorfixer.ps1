$file = ".\node_modules\@feathersjs\hooks\script\hooks.d.ts"
$old_word = "DecoratorContext"
$new_word = "any"
$line_number = 9
$position = 99

$lines = Get-Content -Path $file

if ($lines[$line_number - 1] -match ".*$old_word.*") {
    $lines[$line_number - 1] = $lines[$line_number - 1] -replace "\b$old_word\b", $new_word
}
Set-Content -Path $file -Value $lines
