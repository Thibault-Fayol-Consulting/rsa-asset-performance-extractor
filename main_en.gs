/**
 * --------------------------------------------------------------------------
 * RSA Asset Performance Extractor — Google Ads Script
 * --------------------------------------------------------------------------
 * Extracts headline and description performance labels from Responsive
 * Search Ads via GAQL. Categorizes assets as BEST, GOOD, LOW, or UNRATED.
 *
 * Author:  Thibault Fayol — Thibault Fayol Consulting
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  EMAIL: 'you@example.com',
  SPREADSHEET_URL: '',
  SHEET_NAME: 'RSA Assets'
};

function main() {
  try {
    Logger.log('=== RSA Asset Performance Extractor ===');

    var query =
      'SELECT ad_group_ad_asset_view.field_type, ' +
      'ad_group_ad_asset_view.performance_label, ' +
      'asset.text_asset.text, asset.type, ' +
      'ad_group.name, campaign.name ' +
      'FROM ad_group_ad_asset_view ' +
      'WHERE ad_group_ad_asset_view.field_type IN ("HEADLINE", "DESCRIPTION") ' +
      'AND segments.date DURING LAST_30_DAYS';

    var rows = AdsApp.search(query);
    var assets = [];

    while (rows.hasNext()) {
      var row = rows.next();
      assets.push({
        campaign: row.campaign.name,
        adGroup: row.adGroup.name,
        fieldType: row.adGroupAdAssetView.fieldType,
        performanceLabel: row.adGroupAdAssetView.performanceLabel || 'UNRATED',
        text: row.asset.textAsset.text
      });
    }

    Logger.log('Total assets: ' + assets.length);

    var cats = { BEST: [], GOOD: [], LOW: [], UNRATED: [] };
    for (var i = 0; i < assets.length; i++) {
      var label = assets[i].performanceLabel;
      if (cats[label]) cats[label].push(assets[i]);
      else cats.UNRATED.push(assets[i]);
    }

    Logger.log('BEST: ' + cats.BEST.length + ' | GOOD: ' + cats.GOOD.length +
      ' | LOW: ' + cats.LOW.length + ' | UNRATED: ' + cats.UNRATED.length);

    if (assets.length > 0) sendReport_(cats, assets.length);
    if (CONFIG.SPREADSHEET_URL) exportToSheets_(assets);

  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    MailApp.sendEmail(CONFIG.EMAIL, 'RSA Asset Extractor — Error', e.message);
  }
}

function sendReport_(cats, total) {
  var subject = (CONFIG.TEST_MODE ? '[TEST] ' : '') +
    'RSA Asset Performance — ' + total + ' assets analyzed';

  var body = 'RSA Asset Performance Report\n============================\n\n';
  body += 'Total assets: ' + total + '\n\n';

  body += '--- TOP PERFORMERS (BEST) ---\n';
  if (cats.BEST.length === 0) { body += 'None.\n'; }
  else { for (var i = 0; i < cats.BEST.length; i++) {
    body += '  [' + cats.BEST[i].fieldType + '] "' + cats.BEST[i].text +
      '" — ' + cats.BEST[i].campaign + ' > ' + cats.BEST[i].adGroup + '\n';
  }}

  body += '\n--- WORST PERFORMERS (LOW) ---\n';
  if (cats.LOW.length === 0) { body += 'None.\n'; }
  else { for (var i = 0; i < cats.LOW.length; i++) {
    body += '  [' + cats.LOW[i].fieldType + '] "' + cats.LOW[i].text +
      '" — ' + cats.LOW[i].campaign + ' > ' + cats.LOW[i].adGroup + '\n';
  }}

  body += '\nBEST: ' + cats.BEST.length + ' | GOOD: ' + cats.GOOD.length +
    ' | LOW: ' + cats.LOW.length + ' | UNRATED: ' + cats.UNRATED.length;

  MailApp.sendEmail(CONFIG.EMAIL, subject, body);
}

function exportToSheets_(assets) {
  var ss = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET_URL);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.clear();
  sheet.appendRow(['Campaign', 'Ad Group', 'Field Type', 'Performance', 'Asset Text']);
  for (var i = 0; i < assets.length; i++) {
    var a = assets[i];
    sheet.appendRow([a.campaign, a.adGroup, a.fieldType, a.performanceLabel, a.text]);
  }
  Logger.log('Exported ' + assets.length + ' rows to Sheets.');
}
