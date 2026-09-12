$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$out = Join-Path $root 'web/public/content/interface'
$resource = Join-Path $root 'local-content/interface/.rsrc'
New-Item -ItemType Directory -Force $out | Out-Null
if (-not (Test-Path $resource)) { throw 'Extrae ENCARTAR.DLL en local-content/interface con 7-Zip.' }
foreach ($file in Get-ChildItem "$root/local-content/merged/baggage" -File) {
    if ($file.Extension -in @('.gsm', '.gmo')) {
        $image = [Drawing.Image]::FromFile($file.FullName)
        try { $image.Save((Join-Path $out ($file.Name + '.png')), [Drawing.Imaging.ImageFormat]::Png) }
        finally { $image.Dispose() }
    }
}
$bitmaps = @(15051,15052,15053,15054,15055,15056,15057,15058,15059,15060,15061,15062,15063,15066,15071,15072)
foreach ($id in $bitmaps) {
    $bytes = [IO.File]::ReadAllBytes("$resource/BITMAP/$id.bmp")
    # Some DIB resources have an inaccurate bfOffBits after 7-Zip extraction.
    # For these 24/32-bit BI_RGB resources, pixels follow the 40-byte DIB header.
    if ([BitConverter]::ToInt32($bytes,14) -ne 40 -or [BitConverter]::ToInt32($bytes,30) -ne 0) { throw "DIB no compatible: $id" }
    [BitConverter]::GetBytes([int]54).CopyTo($bytes,10)
    $stream = [IO.MemoryStream]::new($bytes)
    $image = [Drawing.Image]::FromStream($stream)
    try { $image.Save("$out/toolbar-$id.png", [Drawing.Imaging.ImageFormat]::Png) }
    finally { $image.Dispose(); $stream.Dispose() }
}
foreach ($name in @('KIDS_SKY_BG','KIDS_SUBHS_SUBCAT_SEL','KIDS_SUBHS_TOPIC_SEL','KIDS_UNKNOWN_BG')) {
    Copy-Item -LiteralPath "$resource/JPEG/$name" -Destination "$out/$($name.ToLowerInvariant()).jpg" -Force
}
foreach ($id in 31971..31988) {
    Copy-Item -LiteralPath "$resource/WAVE/$id" -Destination "$out/sound-$id.wav" -Force
}
Write-Output 'Interfaz original importada: botones, barra de herramientas, iconos y sonidos.'
$manifest = @(Get-ChildItem -LiteralPath $out -File | Where-Object Name -ne 'files.json' | ForEach-Object { 'interface/' + $_.Name })
[IO.File]::WriteAllText("$out/files.json", (ConvertTo-Json -InputObject $manifest -Compress), [Text.UTF8Encoding]::new($false))
