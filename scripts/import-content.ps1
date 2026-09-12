param([string]$Iso, [string]$SevenZip)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if (-not $Iso) { $Iso = (Get-ChildItem -LiteralPath $root -Filter '*.iso' | Select-Object -First 1).FullName }
if (-not $Iso -or -not (Test-Path -LiteralPath $Iso)) { throw 'No se encuentra la ISO. Usa -Iso ruta.iso.' }
if (-not $SevenZip) { $SevenZip = Join-Path $root 'tools/7zip/7z.exe' }
if (-not (Test-Path -LiteralPath $SevenZip)) { throw 'Indica la ruta de 7z.exe con -SevenZip.' }
$source = Join-Path $root 'local-source'
$merged = Join-Path $root 'local-content/merged'
New-Item -ItemType Directory -Force $source,$merged | Out-Null
& tar -xf $Iso -C $source 'EE/KIDS'
if ($LASTEXITCODE) { throw 'No se pudo extraer EE/KIDS.' }
foreach ($package in Get-ChildItem "$source/EE/KIDS" -Filter '*.EIT' -Recurse | Sort-Object FullName) {
    & $SevenZip x $package.FullName "-o$merged" -y -bso0 -bsp0
    if ($LASTEXITCODE) { throw "No se pudo extraer $($package.Name)" }
}
& $SevenZip x "$source/EE/KIDS/ENCARTAU.DLL" "-o$root/local-content/resources" -y -bso0
if ($LASTEXITCODE) { throw 'No se pudieron extraer los recursos de interfaz.' }
& "$PSScriptRoot/catalog-content.ps1"
& $SevenZip x "$source/EE/KIDS/ENCARTAR.DLL" "-o$root/local-content/interface" -y -bso0
if ($LASTEXITCODE) { throw 'No se pudieron extraer los controles originales.' }
& "$PSScriptRoot/import-interface.ps1"
& node "$PSScriptRoot/patch-flash.mjs"
if ($LASTEXITCODE) { throw 'No se pudo adaptar el reproductor de parejas.' }
