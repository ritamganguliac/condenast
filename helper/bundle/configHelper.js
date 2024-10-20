let configPaths = require('./configPath.json')
export function getBundleConfig(workFlowData) {
    workFlowData.currentComponentConfig =
    {
        "hideDek": JSON.parse(getconfigValue(workFlowData, "hideDek").toLowerCase()),
        "hideByLine": JSON.parse(getconfigValue(workFlowData, "hideByLine").toLowerCase()),
        "hideSummaryCollageOneByLine": JSON.parse(getconfigValue(workFlowData, "hideSummaryCollageOneByLine").toLowerCase()),
        "hideRubric": JSON.parse(isHideRubric(workFlowData, "hideRubric").toLowerCase()),
        "hideHomepageRelated": JSON.parse(getconfigValue(workFlowData, "hideHomepageRelated").toLowerCase()),
        "recommendedHed": getconfigValue(workFlowData, "recommendedHed"),
        "showRiverHed": JSON.parse(getconfigValue(workFlowData, "showRiverHed").toLowerCase()),
        "hideFeatureDekFromIndex": getconfigValue(workFlowData, "hideFeatureDekFromIndex"),
        "hideTickerButton": JSON.parse(getconfigValue(workFlowData, "hideTickerButton").toLowerCase()),
        "showDataSectionTitle": JSON.parse(getconfigValue(workFlowData, "showDataSectionTitle").toLowerCase()),
        "shouldUseDekAsHed": JSON.parse(getconfigValue(workFlowData, "shouldUseDekAsHed").toLowerCase()),
        "summaryCollageEightNineMainHero": JSON.stringify(getconfigValue(workFlowData, "summaryCollageEightNineMainHero")),
        "summaryCollageEightNineMainAside": JSON.stringify(getconfigValue(workFlowData, "summaryCollageEightNineMainAside")),
        "summaryCollageEightNineMainUnder": JSON.stringify(getconfigValue(workFlowData, "summaryCollageEightNineMainUnder")),
        "summaryCollageEightNineRightRail": JSON.stringify(getconfigValue(workFlowData, "summaryCollageEightNineRightRail")),
        "versoIssueInlineLinks": JSON.stringify(getconfigValue(workFlowData, "versoIssueInlineLinks")),
        "versoIssueToc": JSON.stringify(getconfigValue(workFlowData, "versoIssueToc")),
        "versoIssueCover": JSON.stringify(getconfigValue(workFlowData, "versoIssueCover")),
        "summaryCollageFiveCenter": JSON.stringify(getconfigValue(workFlowData, "summaryCollageFiveCenter")),  //This config will be utilised once the element position seems to be stable.
        "summaryCollageFiveAside": JSON.stringify(getconfigValue(workFlowData, "summaryCollageFiveAside")),
        "summaryRiverTrackingSpaceHomePage": JSON.stringify(getconfigValue(workFlowData, "summaryRiverTrackingSpaceHome")),
        "summaryRiverTrackingSpaceGalleryPage": JSON.stringify(getconfigValue(workFlowData, "summaryRiverTrackingSpaceGallery")),
        "summaryCollageFiftyFiftyOneColumn": getconfigValue(workFlowData, "summaryCollageFiftyFiftyOneColumn"),
        "authorTag": getconfigValue(workFlowData, "authorTag"),
        "runwayEvent": getconfigValue(workFlowData, "runwayEvent")
    }
    if (workFlowData.currentComponentName == 'summaryCollageNine')
        workFlowData.currentComponentConfig.shouldHideDangerousDekInSummaryList = JSON.parse(getconfigValue(workFlowData, "summaryCollageNineShouldHideDangerousDekInSummaryList").toLowerCase())
    if (workFlowData.currentComponentName == 'ticker') {
        workFlowData.currentComponentConfig.tickerButtonText = getconfigValue(workFlowData, "tickerButtonText")
        workFlowData.currentComponentConfig.tickerButtonUrl = getconfigValue(workFlowData, "tickerButtonUrl")
    }
    if (workFlowData.currentComponentName == 'versoIssueFeature') {
        workFlowData.currentComponentConfig.hideSectionTitle = JSON.parse(getconfigValue(workFlowData, "versoIssueFeatureHideSectionTitle"));
        workFlowData.currentComponentConfig.hideSourceDek = JSON.parse(getconfigValue(workFlowData, "versoIssueFeatureHideSourceDek"));
        workFlowData.currentComponentConfig.hideItemHed = JSON.parse(getconfigValue(workFlowData, "versoIssueFeatureHideItemHed"));
    }
    if (workFlowData.currentComponentName == 'horizontalList') {
        workFlowData.currentComponentConfig.horizontalListSectionHed = getHorizontalListDangerousHed(workFlowData);
    }
    return workFlowData;
}

export function getconfigValue(workFlowData, configVariableName) {
    var result = undefined;
    for (var i = 0; i < Object.keys(configPaths[configVariableName]['path']).length; i++) {
        if ((workFlowData.currentComponentName.includes('summary') && configVariableName == 'hideFeatureDekFromIndex') || configVariableName != 'hideFeatureDekFromIndex') {
            var currentPath = configPaths[configVariableName]['path'][Object.keys(configPaths[configVariableName].path)[i]];
            if (_.get(workFlowData.brandConfigData.configContent, currentPath) != undefined)
                result = _.get(workFlowData.brandConfigData.configContent, configPaths[configVariableName]['path'][Object.keys(configPaths[configVariableName].path)[i]]);
        }

    }
    return result != undefined ? result : configPaths[configVariableName]['defaultValue'];
}

export function isHideRubric(workFlowData, configVariableName) {
    var result = undefined;
    if (workFlowData.currentComponentName.startsWith('summary') && workFlowData.currentComponentName != 'summaryCollectionRow') {
        var summaryItemLevelConfigPath = _.get(workFlowData.brandConfigData.configContent, configPaths[configVariableName]['path']['summaryItemLevelConfigPath']);
        var versoFeaturesLevelConfigPath = _.get(workFlowData.brandConfigData.configContent, configPaths[configVariableName]['path']['versoFeaturesLevelConfigPath']);
        result = summaryItemLevelConfigPath ? summaryItemLevelConfigPath : versoFeaturesLevelConfigPath ? versoFeaturesLevelConfigPath : undefined;
    }
    else if (workFlowData.currentComponentName == 'river') {
        result = _.get(workFlowData.brandConfigData.configContent, configPaths[configVariableName]['path']['summaryItemLevelConfigPath']) ? _.get(workFlowData.brandConfigData.configContent, configPaths[configVariableName]['path']['summaryItemLevelConfigPath']) : undefined;
    }
    return result != undefined ? result : configPaths[configVariableName]['defaultValue'];
}

export function getPreferenceForCollectionGrid(workFlowData) {
    var result = 'true';
    if (workFlowData.brandConfigData.configContent['generalData']['feature.preferCollectionGrid'] != undefined) {
        result = JSON.parse(workFlowData.brandConfigData.configContent['generalData']['feature.preferCollectionGrid'].toLowerCase());
    }
    if (workFlowData.brandConfigData.configContent[workFlowData.page + 'Config'] && workFlowData.brandConfigData.configContent[workFlowData.page + 'Config']['ComponentConfig.VersoFeatures.settings.shouldPreferCollectionGrid'] != undefined) {
        result = JSON.parse(workFlowData.brandConfigData.configContent[workFlowData.page + 'Config']['ComponentConfig.VersoFeatures.settings.shouldPreferCollectionGrid'].toLowerCase());
    }
    return result;
}

export function getMultiPackageCollageTemplate(workFlowData) {
    var data;
    var result;
    if (workFlowData.page === 'homepage') {
        if (workFlowData.brandConfigData.configContent['homepageConfig']['ComponentConfig.MultiPackages.settings.collageComponentTemplates'] !== undefined) {
            data = JSON.parse(workFlowData.brandConfigData.configContent[workFlowData.page + 'Config']['ComponentConfig.MultiPackages.settings.collageComponentTemplates'].toLowerCase());
            for (let k = 0; k < data.length; k++) {
                result = data[k].template;
            }
        }
    }
    return result;
}

export function getHorizontalListDangerousHed(workFlowData) {
    var result = 'true';
    if (workFlowData.brandConfigData.configContent['homepageConfig']['ComponentConfig.HorizontalList.settings.dangerousHed'] != undefined) {
        result = JSON.parse(workFlowData.brandConfigData.configContent['homepageConfig']['ComponentConfig.HorizontalList.settings.dangerousHed'].toLowerCase());
    }
    return result;
}
