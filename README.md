# RSA Asset Performance Extractor

Extracts performance labels from Responsive Search Ad headlines and descriptions. Identifies your best and worst-performing assets to guide creative optimization.

## What it does

1. Queries `ad_group_ad_asset_view` via GAQL for all RSA headline and description assets
2. Categorizes each asset as BEST, GOOD, LOW, or UNRATED
3. Sends an email report highlighting top and bottom performers
4. Optionally exports all data to a Google Sheets spreadsheet

## Setup

1. Copy `main_en.gs` (or `main_fr.gs`) into a new Google Ads Script
2. Update `CONFIG.EMAIL` with your email address
3. Optionally set `CONFIG.SPREADSHEET_URL` to a Google Sheets URL for export
4. Run and review the report
5. Schedule weekly

## CONFIG reference

| Parameter | Default | Description |
|---|---|---|
| `TEST_MODE` | `true` | Log only mode |
| `EMAIL` | `you@example.com` | Email recipient |
| `SPREADSHEET_URL` | `''` | Google Sheets URL for export (empty = skip) |
| `SHEET_NAME` | `RSA Assets` | Sheet tab name |

## How it works

Uses `AdsApp.search()` with GAQL on `ad_group_ad_asset_view` to retrieve performance labels assigned by Google to each RSA asset. Assets are grouped by performance tier (BEST/GOOD/LOW/UNRATED) and reported via email with campaign and ad group context.

## Requirements

- Google Ads account with active RSA ads
- Permission to send emails (MailApp)
- Optional: Google Sheets access for export

## License

MIT — Thibault Fayol Consulting
