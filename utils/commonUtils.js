let testData = require('../test-data/verso/url.json');
var he = require('he');

export function getIndexWithData(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            return i;
        }
    }
    return null;
}

export function getPageUrl(brand, page, urlIndex, excludeUrlParams = false) {
    if (excludeUrlParams) {
        if (page === 'homepage')
            return testData[Cypress.env('environment')][brand]['homePageUrl'];
        else
            return testData[Cypress.env('environment')][brand]['homePageUrl'] + testData[Cypress.env('environment')][brand][page][urlIndex];
    }
    else {
        if (page === 'homepage')
            return testData[Cypress.env('environment')][brand]['homePageUrl'] + testData.urlParameters;
        else
            return testData[Cypress.env('environment')][brand]['homePageUrl'] + testData[Cypress.env('environment')][brand][page][urlIndex] + testData.urlParameters;
    }
}

export function getPolaroidUrl(brand, page) {
    if (page === 'mainUrl')
        return testData['staging'][brand]['polaroidUrl'];
    else if (page === 'unPublishedShow')
        return testData['staging'][brand]['unPublishedShow'];
    else if (page === 'publishedShow')
        return testData['staging'][brand]['publishedShow'];
    else if (page === 'copilotShow')
        return testData['staging'][brand]['polaroidCopilot'];
}

export function getPageUri(brand, page, urlIndex) {
    let uri;
    if (page != 'homepage') {
        uri = testData[Cypress.env('environment')][brand][page][urlIndex];
        if (uri[0] == '/')
            uri = uri.replace('/', '');
        if (uri[uri.length - 1] == '/')
            uri = uri.split("").reverse().join("").replace('/', '').split("").reverse().join("");
    }
    else
        uri = '';
    return uri;
}

export function getBrandNameAsPerFooter(workflowData) {
    if (testData[Cypress.env('environment')][workflowData.brand]['footerBrandName'])
        return testData[Cypress.env('environment')][workflowData.brand]['footerBrandName'];
    else
        return workflowData.brand;
}

export function normaliseText(text) {
    text = text.replace(/(<([^>]+)>)/ig, "")
    text = text.replaceAll(/\{.*\}/g, '');
    text = text.replace(/ *\([^)]*\)*/g, '');
    var subStringsToRemove = ['<em>', '</em>', '<strong>', '</strong>', '\\', '*', ' \n', '\n', '[', ']', '~', ',', '-', '_'];
    for (var i = 0; i < subStringsToRemove.length; i++) {
        text = text.replaceAll(subStringsToRemove[i], '');
    }
    text = text.replaceAll(/\(https.*\)/g, '');
    text = text.replace(/  +/g, ' ');
    text = text.replace(/—/g, ' ')
    text = text.replaceAll('&#8217;', "'");
    text = text.replaceAll("’", "'");
    text = he.decode(text);
    text = text.trim();
    text = text.toLowerCase();
    text = text.replaceAll("^", "");
    text = text.replace('x7e', '');
    text = text.replaceAll('glück', '')
    text = text.replaceAll('erfolg', '')
    return text;
}

/**
 * 
 * The scope of this function is to eliminate HTML Contents from the given string and return the plain text
 * 
 * Ex : 
 * 
 * Input Str - '© 2021 Condé Nast. All rights reserved. Use of this website constitutes acceptance of our <a class="external-link" data-event-click="{&quot;element&quot;:&quot;ExternalLink&quot;,&quot;outgoingURL&quot;:&quot;https://www.architecturaldigest.in/terms/&quot;}" href="https://www.architecturaldigest.in/terms/" rel="nofollow noopener" target="_blank"> Terms of Service</a> (updated 1/1/20) and <a class="external-link" data-event-click="{&quot;element&quot;:&quot;ExternalLink&quot;,&quot;outgoingURL&quot;:&quot;https://www.architecturaldigest.in/privacy-policy/&quot;}" href="https://www.architecturaldigest.in/privacy-policy/" rel="nofollow noopener" target="_blank">Policy and Cookie Statement</a> (updated 18/11/20). The material on this site may not be reproduced, distributed, transmitted, cached or otherwise used, except with the prior written permission of Condé Nast.'
 * Output Str - '© 2021 Condé Nast. All rights reserved. Use of this website constitutes acceptance of our  Terms of Service (updated 1/1/20) and Policy and Cookie Statement (updated 18/11/20). The material on this site may not be reproduced, distributed, transmitted, cached or otherwise used, except with the prior written permission of Condé Nast.'
 * 
 */

export function htmlEliminator(str) {
    let start = 0;
    let end = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] === '<') {
            start = i;
            for (var j = i + 1; j < str.length; j++) {
                if (str[j] === '>') {
                    end = j;
                    break;
                }
            }
            if (start == 0)
                str = str.substring(end + 1, str.length);
            else if (start > 0 && end < str.length)
                str = str.substring(0, start) + str.substring(end + 1, str.length);
            else
                str = str.substring(0, start);
        }
    }
    return str;
}
export function xClientKey() {
    return Cypress.env('environment') === 'staging'
        ? Cypress.env('SECRET_KEY_STAG')
        : Cypress.env('SECRET_KEY_PROD')
};

export function generateEmail() {
    const date = Date.now();
    return `automation${date}@condenast.com`;
};

export function getMagicLink(auth, email) {
    let magicLink = '';
    return cy.request({
        method: 'POST',
        url: auth.url,
        headers: {
            'content-type': "application/json",
            'x-client': "cypress-automation",
            'x-client-key': xClientKey(),
            'User-Agent': "qa-cypress-test"
        },
        body: {
            data: {
                email: email,
                attributes: {
                    siteCode: auth.body.siteCode,
                    registrationSourceCode:
                        auth.body.registrationSourceCode,
                    oidcParams: {
                        client_id: auth.body.client_id,
                        redirect_uri: auth.body.redirect_uri,
                        state: auth.body.state,
                    },
                },
            },
        },
    })
        .then((response) => {
            magicLink = response.body.data.attributes.magicLinkUrl;
            return magicLink;
        });
};
