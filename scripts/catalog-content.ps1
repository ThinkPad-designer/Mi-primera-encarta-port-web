$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$merged = Join-Path $root 'local-content/merged'
$out = Join-Path $root 'web/public/content'
New-Item -ItemType Directory -Force $out | Out-Null
function Plain($node) {
    if ($null -eq $node) { return '' }
    $text = if ($node -is [System.Xml.XmlNode]) { $node.InnerText } else { [string]$node }
    return ([System.Net.WebUtility]::HtmlDecode(($text -replace '<[^>]*>', ' ')) -replace '\s+', ' ').Trim()
}
$files = [System.Collections.Generic.List[string]]::new()
foreach ($file in Get-ChildItem $merged -File -Recurse) {
    $rel = $file.FullName.Substring($merged.Length + 1).Replace('\','/').ToLowerInvariant()
    if ($rel -notmatch '^(dswmedia/|baggage/)' -or $rel -notmatch '\.(swf|xml|iax|jpg|jpeg|gif|png|mp3|wma|smi)$') { continue }
    $target = Join-Path $out $rel
    New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
    if (-not (Test-Path $target) -or (Get-Item $target).Length -ne $file.Length) { Copy-Item -LiteralPath $file.FullName -Destination $target -Force }
    $files.Add($rel)
}
$catalog = [System.Collections.Generic.List[object]]::new()
foreach ($file in Get-ChildItem "$merged/baggage" -Filter '*.iax' | Sort-Object Name) {
    $doc = [System.Xml.XmlDocument]::new(); $doc.XmlResolver = $null; $doc.Load($file.FullName)
    $ia = $doc.DocumentElement
    $id = $ia.GetAttribute('id').ToLowerInvariant()
    if ($id -notmatch '^[a-f0-9]{8}$') { throw "ID desconocido en $($file.Name)" }
    $slides = @($ia.SelectNodes('slides/slide') | ForEach-Object {
        $slide = $_.SelectSingleNode('standardslide')
        if ($null -eq $slide) { return }
        $image = Plain $slide.SelectSingleNode('image')
        $asset = "dswmedia/iaf/e/$id/$image".ToLowerInvariant()
        $labels = @($slide.SelectNodes('labels/label') | ForEach-Object {
            @{title=(Plain $_.SelectSingleNode('labeltext')); text=(Plain $_.SelectSingleNode('caption/body'))}
        })
        @{title=(Plain $slide.SelectSingleNode('caption/title')); text=(Plain $slide.SelectSingleNode('caption/body')); image=$(if ($files.Contains($asset)) {$asset} else {''}); labels=$labels}
    })
    $title = [string]($slides | Where-Object title | Select-Object -First 1).title
    if (-not $title -or $title -eq 'Slide caption title') { $title = $ia.GetAttribute('friendlyname') -replace '^KIDS\s*[:\-]?\s*','' }
    $preview = [string]($slides | Where-Object { $_.image -match '\.(jpg|png|gif)$' } | Select-Object -First 1).image
    if (-not $preview) { $preview = [string]($files | Where-Object { $_ -match "^dswmedia/iaf/e/$id/.*\.(jpg|png|gif)$" } | Select-Object -First 1) }
    $control = $ia.GetAttribute('basecontroltype')
    $definition = "dswmedia/iaf/e/$id/$id.iax"
    New-Item -ItemType Directory -Force (Split-Path (Join-Path $out $definition)) | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $out $definition) -Force
    $files.Add($definition)
    $catalog.Add(@{id=$id; title=$title; originalName=$ia.GetAttribute('friendlyname'); type=$control; width=[int]$ia.GetAttribute('width'); height=[int]$ia.GetAttribute('height'); definition=$definition; preview=$preview; slides=$slides; kind=$(if ($control -in @('DragDrop','MatchGame','BGAControl')) {'Juegos'} else {'Exploraciones'})})
}
$utf8 = [System.Text.UTF8Encoding]::new($false)
[IO.File]::WriteAllText("$out/catalog.json", (ConvertTo-Json -InputObject @($catalog.ToArray()) -Depth 10), $utf8)
[IO.File]::WriteAllText("$out/files.json", (ConvertTo-Json -InputObject @($files.ToArray()) -Compress), $utf8)
$background = "$root/local-content/resources/.rsrc/1033/JPEG/KIDSARTBACK"
if (Test-Path $background) { Copy-Item $background "$out/article-background.jpg" -Force }
Write-Output "Importadas $($catalog.Count) actividades y $($files.Count) recursos originales."
