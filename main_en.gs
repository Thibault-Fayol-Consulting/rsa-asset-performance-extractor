/**
 * --------------------------------------------------------------------------
 * rsa-asset-performance-extractor - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true };
function main() {
    Logger.log("Extracting RSA Asset performances...");
    var adIter = AdsApp.ads().withCondition("Type = RESPONSIVE_SEARCH_AD").withCondition("Status = ENABLED").get();
    var count = 0;
    while(adIter.hasNext() && count < 20) {
        var ad = adIter.next().asType().responsiveSearchAd();
        // Asset access requires API queries via AWQL ad_group_ad_asset_view
        Logger.log("Scanned RSA: " + ad.getId());
        count++;
    }
}
