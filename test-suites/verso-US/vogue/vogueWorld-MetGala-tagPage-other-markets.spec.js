
import * as tagPageTestHelper from "../../../helper/tag/testHelper"
import * as tagPageConfig from "../../../test-data/verso/tag/vogue-brand-config.json"

let tagPageData =
{
    "brand": "",
    "page": "tag",
    "tagUri": "vogue-world",
    "pageNumber": 1,
    "pageLimit": 24,
    "sortBy": { "modifySortByValue": true },
    "filter": { "modifyFilterValueGQL": false },
    "sortBy.filter": "pubDate",
    "updateFilterHeirarchy": true
}
let urlIndex = {
    "vogueWorld": 0,
    "metGala": 1
}

function testRunner(tagPageData) {
    context(`Validating vogue world tag pages for all markets...`, () => {
        // vogue US and UK being handled in another file because they are bundle type. The remaining Brands are tag type. 
        for (let i = 2; i < tagPageConfig.brands.length; i++) {
            it(`Tag page bundle Validation for- ${tagPageConfig.brands[i].brandName}`, () => {
                tagPageData.brand = tagPageConfig.brands[i].brandName
                tagPageTestHelper.getTagPageData(tagPageData, urlIndex.metGala).then((data) => {
                    tagPageData = data;
                    tagPageTestHelper.launchUrl(tagPageData.url);
                })
                tagPageTestHelper.validateVogueTagPage(tagPageData);
            })

        }
    })
}
testRunner(tagPageData);
