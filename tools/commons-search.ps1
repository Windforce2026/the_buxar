<#
  commons-search.ps1 - find freely-licensed images on Wikimedia Commons.

  Reads one search term per argument (or from stdin), and prints a
  candidate table: title, licence, author, pixel size, thumb URL.

  Licence metadata comes straight from the file's own extmetadata, so a
  candidate can be credited correctly before it is ever downloaded.

  Usage:
    powershell -File tools/commons-search.ps1 "Buxar market" "Indian handloom"
#>
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Terms)

$ErrorActionPreference = 'Stop'
$UA = 'TheBuxarMarketplace/1.0 (https://www.thebuxar.com; contact hello@thebuxar.com)'
$API = 'https://commons.wikimedia.org/w/api.php'

# Only licences we can actually ship on a commercial client site.
$OK_LICENCE = '^(cc0|cc by|cc by-sa|public domain|pd|no restrictions|attribution)'

function Search-Commons {
  param([string]$Term, [int]$Limit = 12)

  $params = @{
    action       = 'query'
    format       = 'json'
    generator    = 'search'
    gsrsearch    = $Term
    gsrnamespace = '6'
    gsrlimit     = $Limit
    prop         = 'imageinfo'
    iiprop       = 'url|size|extmetadata|mime'
    iiurlwidth   = '1600'
  }
  $query = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([uri]::EscapeDataString($_.Value))" }) -join '&'

  try {
    $res = Invoke-RestMethod -Uri "$API`?$query" -Headers @{ 'User-Agent' = $UA } -TimeoutSec 40
  } catch {
    Write-Output "  !! query failed: $($_.Exception.Message)"
    return
  }
  if (-not $res.query) { return }

  $pages = $res.query.pages.PSObject.Properties.Value

  foreach ($p in $pages) {
    $ii = $p.imageinfo[0]
    if (-not $ii) { continue }
    if ($ii.mime -ne 'image/jpeg' -and $ii.mime -ne 'image/png' -and $ii.mime -ne 'image/webp') { continue }
    # Skip tiny files - they look bad as editorial photography.
    if ($ii.width -lt 900) { continue }

    $em = $ii.extmetadata
    $licence = ''
    if ($em.LicenseShortName) { $licence = $em.LicenseShortName.value }
    $author = ''
    if ($em.Artist) { $author = ($em.Artist.value -replace '<[^>]+>', '' -replace '\s+', ' ').Trim() }
    $credit = ''
    if ($em.Credit) { $credit = ($em.Credit.value -replace '<[^>]+>', '' -replace '\s+', ' ').Trim() }

    if ($licence -notmatch $OK_LICENCE) { continue }

    [pscustomobject]@{
      Title    = $p.title -replace '^File:', ''
      Licence  = $licence
      Author   = if ($author.Length -gt 44) { $author.Substring(0, 44) + '..' } else { $author }
      Size     = '{0}x{1}' -f $ii.width, $ii.height
      Weight   = [math]::Round($ii.size / 1KB)
      PageUrl  = $ii.descriptionurl
      Thumb    = $ii.thumburl
    }
  }
}

foreach ($term in $Terms) {
  Write-Output ""
  Write-Output "=============================================================="
  Write-Output "  QUERY: $term"
  Write-Output "=============================================================="
  $found = @(Search-Commons -Term $term)
  if ($found.Count -eq 0) {
    Write-Output "  (no freely-licensed candidate at 900px+)"
    continue
  }
  $found | Sort-Object Weight | ForEach-Object {
    Write-Output ("  {0,-52} | {1,-16} | {2,-44} | {3,-10} | {4,6}KB" -f `
      $_.Title, $_.Licence, $_.Author, $_.Size, $_.Weight)
    Write-Output ("      {0}" -f $_.PageUrl)
  }
}