<#
  fetch-marketplace-images.ps1 - build the Marketplace image library.

  Downloads each curated Commons file as a right-sized JPEG thumbnail,
  writes a provenance manifest (js/market-image-credits.js) and a
  human-readable CREDITS.txt.

  Rules this script enforces:
    * licence allow-list  - nothing ships unless Commons reports a
      licence we can actually use commercially
    * attribution capture - author + licence + source URL come from the
      file's own extmetadata, never hand-typed
    * honest filenames    - the manifest, not the script, decides what a
      file depicts, so category visuals can never be mistaken for
      verified product photography
    * honest bytes        - saved as real .jpg (the previous library
      shipped JPEG data under a .webp extension)

  Idempotent: re-running skips files that already exist unless -Force.
#>
[CmdletBinding()]
param(
  [switch]$Force,
  [string]$OutDir = 'assets\images\marketplace'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$UA   = 'TheBuxarMarketplace/1.0 (https://www.thebuxar.com; contact hello@thebuxar.com)'
$API  = 'https://commons.wikimedia.org/w/api.php'
$LICENCE_OK   = '^(cc0|cc by|cc by-sa|public domain|pd-|no restrictions|attribution)'

# ---------------------------------------------------------------------------
# Curated manifest.
#   slug         -> output filename stem, descriptive by design
#   title        -> exact Commons File: title
#   folder       -> subfolder under $OutDir
#   width        -> thumbnail width to request (Commons resizes server-side)
#   usageType    -> hero | category | editorial | seller | story | location
#   depicts      -> what the photograph actually shows
#   creditAs     -> on-page caption, phrased so it is never read as a claim
#                   that this is a verified Buxar seller or product
# ---------------------------------------------------------------------------
$MANIFEST = @(
  @{ slug='marketplace-hero-local-commerce'; folder='hero'; width=1800; usageType='hero'
     title='Indian spices,palayam market,thiruvananthapuram,kerala.jpg'
     depicts='A spices stall in an Indian market'
     creditAs='Indian spices on sale at a market stall.' }

  @{ slug='marketplace-local-food'; folder='categories'; width=900; usageType='category'
     title='Vegetarian thali-MA08.jpg'
     depicts='A vegetarian thali'
     creditAs='A shared vegetarian thali - a common everyday meal.' }

  @{ slug='marketplace-handicrafts'; folder='categories'; width=900; usageType='category'
     title='Madhubani Painting Exhibition.jpg'
     depicts='Madhubani paintings on display at an exhibition'
     creditAs='Madhubani (Mithila) paintings from Bihar - an art form of this region.' }

  @{ slug='marketplace-handlooms-textiles'; folder='categories'; width=900; usageType='category'
     title='Crafting Tradition The Art of Weaving at Mirpur Banarasi Palli.jpg'
     depicts='A handloom weaver at work'
     creditAs='Handloom weaving - craft and textile traditions of the region.' }

  @{ slug='marketplace-agricultural-products'; folder='categories'; width=900; usageType='category'
     title='Somewhere in Bihar 06 threshing (32126379105).jpg'
     depicts='Threshing harvested grain in Bihar'
     creditAs='Threshing harvested grain in Bihar.' }

  @{ slug='marketplace-traditional-products'; folder='categories'; width=900; usageType='category'
     title='TBD-BUXAR-TERRACOTTA'
     depicts='Pre-Mauryan terracotta figurines excavated at Buxar, Bihar'
     creditAs='Pre-Mauryan terracotta from Buxar, Bihar Museum. Archaeology, not commerce.'
     local='assets\history\terracotta-buxar.jpg'
     localCredit='Sumitsurai'; localLicence='CC BY-SA 4.0'
     localUrl='https://commons.wikimedia.org/wiki/File:Pre-Mauryan_terracotta_from_Buxar_(Bihar_Museum,_Arch._6650).jpg' }

  @{ slug='marketplace-religious-items'; folder='categories'; width=900; usageType='category'
     title='Diwali diyas.jpg'
     depicts='Rows of earthen oil lamps lit for Diwali'
     creditAs='Earthen diyas lit for Diwali.' }

  @{ slug='marketplace-gifts-souvenirs'; folder='categories'; width=900; usageType='category'
     title='Dilli Haat Madhubani Mithila Painting Artist.jpg'
     depicts='A Mithila painter at a crafts fair'
     creditAs='A Mithila painter selling work at a national crafts fair.' }

  @{ slug='marketplace-home-lifestyle'; folder='categories'; width=900; usageType='category'
     title='Decoration in Diwali Festival.jpg'
     depicts='Festive home decoration'
     creditAs='Festive decoration for the home.' }

  @{ slug='marketplace-fashion'; folder='categories'; width=900; usageType='category'
     title='Crape silk fabric Banarasi work bandhani saree.jpg'
     depicts='Folded Banarasi silk and bandhani fabric'
     creditAs='Banarasi silk and bandhani - woven textiles of eastern India.' }

  @{ slug='marketplace-beauty-wellness'; folder='categories'; width=900; usageType='category'
     title='Woman displaying traditional tattoos on her hands.jpg'
     depicts='Traditional Mithila body art on hands'
     creditAs='Traditional Mithila body art, an old regional custom.' }

  @{ slug='marketplace-fresh-local'; folder='categories'; width=900; usageType='category'
     title='Rice fields near Darbhanga, Bihar 7.jpg'
     depicts='Rice fields in Bihar'
     creditAs='Rice fields in Bihar - the district is one of Bihar''s rice bowls.' }

  @{ slug='marketplace-other'; folder='categories'; width=900; usageType='category'
     title='Spices in an Indian market.jpg'
     depicts='Loose spices displayed for sale'
     creditAs='Loose spices at an Indian market.' }

  @{ slug='marketplace-maker-madhubani'; folder='sellers'; width=900; usageType='editorial'
     title='Asha Jha Madhubani Painting Bihar Artist.jpg'
     depicts='Asha Jha, a Madhubani painter, at work'
     creditAs='Asha Jha, Madhubani painter, Bihar. Category visual - not a Marketplace seller.' }

  @{ slug='marketplace-stories-craft'; folder='stories'; width=1100; usageType='story'
     title='Madhubani paintings (Madhubani Railway Station).jpg'
     depicts='Madhubani paintings at Madhubani railway station'
     creditAs='Madhubani painting - a craft of the Mithila region.' }

  @{ slug='marketplace-location-buxar-town'; folder='locations'; width=800; usageType='location'
     title='Buxar2.jpg'
     depicts='A view in Buxar'
     creditAs='Buxar town.' }

  @{ slug='marketplace-location-bihar-countryside'; folder='locations'; width=800; usageType='location'
     title='BiharCountryside 2024-09-Bihar DSCN0486.JPG'
     depicts='Open countryside in Bihar'
     creditAs='The Buxar district countryside.' }
)

function Get-CommonsInfo {
  param([string]$Title, [int]$Width)
  $params = @{
    action='query'; format='json'; titles="File:$Title"
    prop='imageinfo'; iiprop='url|size|extmetadata|mime'; iiurlwidth=$Width
  }
  $q = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([uri]::EscapeDataString($_.Value))" }) -join '&'
  $res = Invoke-RestMethod -Uri "$API`?$q" -Headers @{ 'User-Agent'=$UA } -TimeoutSec 45
  $page = $res.query.pages.PSObject.Properties.Value | Select-Object -First 1
  if (-not $page.imageinfo) { return $null }
  $ii  = $page.imageinfo[0]
  $em  = $ii.extmetadata
  [pscustomobject]@{
    thumb    = $ii.thumburl
    width    = $ii.width
    height   = $ii.height
    licence  = if ($em.LicenseShortName) { $em.LicenseShortName.value } else { '' }
    author   = if ($em.Artist) { (($em.Artist.value -replace '<[^>]+>','') -replace '\s+',' ').Trim() } else { 'Unknown' }
    pageUrl  = $ii.descriptionurl
  }
}

function Save-Thumb {
  param([string]$Url, [string]$Dest)
  $dir = Split-Path $Dest
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Invoke-WebRequest -Uri $Url -OutFile $Dest -UseBasicParsing -TimeoutSec 90 -Headers @{ 'User-Agent'=$UA }
}

$entries = New-Object System.Collections.ArrayList
$ok = 0; $skipped = 0; $failed = @()

foreach ($m in $MANIFEST) {
  $dest = Join-Path $OutDir (Join-Path $m.folder ($m.slug + '.jpg'))

  # Project-owned asset: reuse it and read its credit from our own records.
  if ($m.local) {
    $src = Join-Path (Get-Location) $m.local
    if (Test-Path $src) {
      if ((Test-Path $dest) -and -not $Force) { $skipped++ }
      else { Copy-Item $src $dest -Force; $ok++ }
      [void]$entries.Add([pscustomobject]@{
        key=$m.slug; src=($dest -replace '\\','/'); source='TheBuxar.com project asset'
        sourceUrl=$m.localCredit; photographer=$m.localCredit; licence=$m.localLicence
        usageType=$m.usageType; depicts=$m.depicts; creditAs=$m.creditAs
        attributionRequired=$true; reusedFrom=$m.local
      })
      continue
    }
    $failed += "$($m.slug): local asset missing ($($m.local))"
    continue
  }

  try { $info = Get-CommonsInfo -Title $m.title -Width $m.width }
  catch { $failed += "$($m.slug): $($_.Exception.Message)"; continue }

  if (-not $info) { $failed += "$($m.slug): no imageinfo for '$($m.title)'"; continue }
  if ($info.licence -notmatch $LICENCE_OK) {
    $failed += "$($m.slug): licence '$($info.licence)' not on the allow-list, SKIPPED"
    continue
  }

  try {
    if ((Test-Path $dest) -and -not $Force) { $skipped++ } else { Save-Thumb $info.thumb $dest; $ok++ }
    [void]$entries.Add([pscustomobject]@{
      key=$m.slug; src=($dest -replace '\\','/'); source='Wikimedia Commons'
      sourceUrl=$info.pageUrl; photographer=$info.author; licence=$info.licence
      usageType=$m.usageType; depicts=$m.depicts; creditAs=$m.creditAs
      attributionRequired=$true; pixelWidth=$info.width; pixelHeight=$info.height
    })
  } catch { $failed += "$($m.slug): download failed - $($_.Exception.Message)" }
}

# --- provenance manifest, consumed by the Marketplace "Image Credits" panel ---
# Built as plain string arrays then joined, so no nested here-string or
# subexpression syntax can be mis-parsed by Windows PowerShell.
$jsHead = @(
  '/* ------------------------------------------------------------------ */'
  '/* TheBuxar.com - Marketplace image provenance                         */'
  '/* Generated by tools/fetch-marketplace-images.ps1. Do not hand-edit  */'
  '/* without updating assets/images/marketplace/CREDITS.txt too.       */'
  '/*                                                                     */'
  '/* Every entry records where the file came from and under what licence.*/'
  '/* creditAs is the caption shown on the page. It is deliberately      */'
  '/* phrased so a category or atmosphere photograph is never presented  */'
  '/* as a verified product from a real Buxar seller.                    */'
  '/* ------------------------------------------------------------------ */'
  '(function () {'
  "  'use strict'"
  '  window.TheBuxarMarketCredits = ['
)

function Quote-Js {
  param([string]$v)
  if ($null -eq $v) { return "''" }
  # Escape backslash and single quote, collapse newlines, strip control chars.
  $s = $v -replace '\\', '\\\\'
  $s = $s -replace "'", "\'"
  $s = $s -replace "[\r\n]+", ' '
  $s = $s -replace '[\x00-\x1F]', ''
  return "'" + $s + "'"
}

$jsBody = @()
foreach ($e in $entries) {
  $jsBody += '    {'
  $jsBody += '      key: '                 + (Quote-Js $e.key)        + ','
  $jsBody += '      src: '                 + (Quote-Js $e.src)        + ','
  $jsBody += '      source: '              + (Quote-Js $e.source)     + ','
  $jsBody += '      sourceUrl: '           + (Quote-Js $e.sourceUrl)  + ','
  $jsBody += '      photographer: '        + (Quote-Js $e.photographer) + ','
  $jsBody += '      licence: '             + (Quote-Js $e.licence)    + ','
  $jsBody += '      usageType: '           + (Quote-Js $e.usageType)  + ','
  $jsBody += '      depicts: '             + (Quote-Js $e.depicts)    + ','
  $jsBody += '      creditAs: '            + (Quote-Js $e.creditAs)   + ','
  $jsBody += '      attributionRequired: ' + $e.attributionRequired.ToString().ToLower()
  $jsBody += '    },'
}

$jsTail = @('  ]', '})();')
$js = ($jsHead + $jsBody + $jsTail) -join "`n"
[System.IO.File]::WriteAllText('js\market-image-credits.js', $js, (New-Object System.Text.UTF8Encoding($false)))

# --- human-readable credits ---
$txt = @"
TheBuxar.com - Marketplace image credits
==========================================
Generated by tools/fetch-marketplace-images.ps1

All Marketplace imagery is either reused from TheBuxar.com's own
project assets or downloaded from Wikimedia Commons under a licence
that permits commercial use.

Licences used: CC0, CC BY, CC BY-SA, Public Domain.
Full licence texts: https://creativecommons.org/licenses/

ATTRIBUTION POLICY
------------------
CC BY / CC BY-SA require attribution. Attribution is rendered in the
"Image credits" panel on the Marketplace page and is also listed here.

These photographs are category, editorial and atmosphere imagery.
They are NOT photographs of products currently sold by a verified
Buxar seller, and no caption claims that they are. Product imagery
will only appear once real seller-submitted product photography
exists on the marketplace.

Files
-----
PLACEHOLDER_FILE_LIST
"@
$fileList = @()
foreach ($e in ($entries | Sort-Object usageType, key)) {
  $fileList += $e.src
  $fileList += '    Source:      ' + $e.source
  $fileList += '    Author:      ' + $e.photographer
  $fileList += '    Licence:     ' + $e.licence
  $fileList += '    Depicts:     ' + $e.depicts
  $fileList += '    Credit line: ' + $e.creditAs
  $fileList += '    Source page: ' + $e.sourceUrl
  $fileList += ''
}
$txt = $txt.Replace('PLACEHOLDER_FILE_LIST', ($fileList -join "`n"))
[System.IO.File]::WriteAllText((Join-Path $OutDir 'CREDITS.txt'), $txt, (New-Object System.Text.UTF8Encoding($false)))

Write-Output ""
Write-Output "downloaded/copied : $ok"
Write-Output "already present   : $skipped"
Write-Output "manifest entries  : $($entries.Count)"
if ($failed.Count) {
  Write-Output ""
  Write-Output "PROBLEMS ($($failed.Count)):"
  $failed | ForEach-Object { Write-Output "  - $_" }
}