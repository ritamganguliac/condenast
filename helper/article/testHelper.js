import * as dataHelper from "./contentDataHelper";
import * as utils from "../../utils/commonUtils";

export function getArticleInfo(workFlowData, articleData, UrlIndex) {
    workFlowData.url = utils.getPageUrl(workFlowData.brand, workFlowData.page, UrlIndex);
    cy.visit(workFlowData.url, { retryOnStatusCodeFailure: true });
    workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, UrlIndex);
    return dataHelper.getArticleData(workFlowData, articleData, UrlIndex).then((data) => {
        articleData = data;
        return articleData;
    })
}

export function validateArticleContentHeaderAndBody(workFlowData, articleData) {
    let articleWorkFlow = articleData.data.getArticle;
    cy.validateArticleContentHeaderAndBody(workFlowData, articleWorkFlow)
}

export function validateArticleCartoonEmbeds(workFlowData, articleData) {
    let articleWorkFlow = articleData.data.getArticle;
    cy.validateArticleConnectedEmbeds(workFlowData, articleWorkFlow)
}

export function validateMoreGreatFashionStoriesList(articleData) {
    cy.validateMoreGreatFashionStoriesList(articleData)
}
export function validateNewsletterSubscribeForm(workFlowData, articleData) {
    cy.validateNewsletterSubscribeForm(workFlowData, articleData)
}

export function validateSocialIcons(workFlowData, articleData) {
    cy.validateSocialIcons(workFlowData, articleData)
}

export function getArticleUpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let edge_path = data.getArticle.body.connectedEmbeds.edges;
        const productName = edge_path.map((edge) => edge.node?.name);
        const productId = edge_path.map((edge) => edge.node?.id);
        const retailerUri = edge_path.flatMap((edge) => edge.node.offers?.map((offer) => offer?.purchaseUri));
        const sellerName = edge_path.flatMap((edge) => edge.node.offers?.map((offer) => offer?.sellerName));
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["Net-a-Porter", "COS", "H&M", "NET-A-PORTER", "Cos", "Massimo Dutti", "Net-a-Porter "].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [updatedretailerUri, updatedsellerName, productId, productName, totalProducts];
    })
}

export function getGalleryUpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let item_path = data.getGallery.itemsPageN.items;
        const productName = item_path.map((galleryItem) => galleryItem.item?.name);
        const productId = item_path.map((galleryItem) => galleryItem.item?.id);
        const retailerUri = item_path.flatMap((galleryItem) => galleryItem.item.offers[0].purchaseUri);
        const sellerName = item_path.flatMap((galleryItem) => galleryItem.item.offers[0].sellerName);
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["NET-A-PORTER", "COS", "H&M", "Net-a-Porter", "Cos", "Massimo Dutti", "Bumble and Bumble "].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www.bumbleandbumble.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [updatedretailerUri, updatedsellerName, productId, productName, totalProducts];
    })
}

export function getGallery_Vogue_US_UpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let edge_path = data.getGallery.body.connectedEmbeds.edges;
        const productName = edge_path.map((edge) => edge.node?.name);
        const productId = edge_path.map((edge) => edge.node?.id);
        const retailerUri = edge_path.flatMap((edge) => edge.node.offers?.map((offer) => offer?.purchaseUri));
        const sellerName = edge_path.flatMap((edge) => edge.node.offers?.map((offer) => offer?.sellerName));
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["NET-A-PORTER", "COS", "H&M", "Net-a-Porter", "Cos", "Massimo Dutti"].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [updatedretailerUri, updatedsellerName, productId, productName, totalProducts];
    })
}


export function getPLPUpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let edge_path = data.getBundle.containers.results[0].itemSets[0].items?.edges;
        const productName = edge_path.map((bundleItem) => bundleItem?.contextualHed);
        const productId = edge_path.map((bundleItem) => bundleItem?.node.tout.id);
        const retailerUri = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.purchaseUri));
        const sellerName = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.sellerName));
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["NET-A-PORTER", "COS", "H&M", "Net-a-Porter", "Cos", "Massimo Dutti", "Mr Porter", "Levi's", "REI"].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1 &&
            element.toLowerCase().indexOf("www.mrporter.com") === -1 &&
            element.toLowerCase().indexOf("www.levi.com") === -1 &&
            element.toLowerCase().indexOf("www.rei.com") === -1 &&
            element.toLowerCase().indexOf("www.zara.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [productName, updatedretailerUri, updatedsellerName, productId, totalProducts];
    })
}

export function getUKPLPUpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let edge_path = data.getBundle.containers.results[0].itemSets[0].items?.edges;
        const productName = edge_path.map((bundleItem) => bundleItem?.node?.name);
        const productId = edge_path.map((bundleItem) => bundleItem?.node.tout?.id);
        const retailerUri = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.purchaseUri));
        const sellerName = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.sellerName));
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["NET-A-PORTER", "COS", "H&M", "Net-a-Porter", "Cos", "Massimo Dutti"].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1 &&
            element.toLowerCase().indexOf("www.massimodutti.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [productName, updatedretailerUri, updatedsellerName, productId, totalProducts];
    })
}

export function getSelf_US_PLPUpcInfo(query) {
    return dataHelper.getUpcData(query).then((data) => {
        let edge_path = data.getBundle.containers.results[1].itemSets[0].items?.edges;
        const productName = edge_path.map((bundleItem) => bundleItem?.node?.name);
        const productId = edge_path.map((bundleItem) => bundleItem?.node.id);
        const retailerUri = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.purchaseUri));
        const sellerName = edge_path.flatMap((bundleItem) => bundleItem.node.offers?.map((offer) => offer?.sellerName));
        const updatedsellerName = sellerName.filter(element =>
            element !== undefined &&
            !["NET-A-PORTER", "COS", "H&M", "Net-a-Porter", "Cos"].includes(element)).map(str => str.trim());
        const updatedretailerUri = retailerUri.filter(element =>
            element !== undefined &&
            element.toLowerCase().indexOf("www.net-a-porter.com") === -1 &&
            element.toLowerCase().indexOf("www.cos.com") === -1 &&
            element.toLowerCase().indexOf("www2.hm.com") === -1
        );
        const totalProducts = updatedretailerUri.length;
        return [productName, updatedretailerUri, updatedsellerName, productId, totalProducts];
    })
}

export function getRandomNumber(minValue, maxValue) {
    const random = Math.random();
    const randomNumber = Math.floor(random * (maxValue - minValue + 1)) + minValue;
    return randomNumber;
}

export function validateImageAspectRatio(imageSelector) {
    cy.window().then((win) => {
        cy.get(imageSelector).first().then(($el) => {
            const style = win.getComputedStyle($el[0]);
            const actualWidth = parseFloat(style.width);
            const actualHeight = parseFloat(style.height);
            const aspectRatio = (actualWidth / actualHeight).toFixed(2);
            expect(aspectRatio).to.equal('0.75');
            return aspectRatio;
        })
    })
}

export function getCartoonCaptionInfo(workFlowData, cartoonCaptionData, UrlIndex, captionStage) {
    workFlowData.url = utils.getPageUrl(workFlowData.brand, workFlowData.page, UrlIndex);
    cy.visit((workFlowData.url).split('?')[0]);
    return dataHelper.getCartoonCaptionData(cartoonCaptionData, captionStage).then((data) => {
        cartoonCaptionData = data;
        return cartoonCaptionData;
    })
}

export function validateCartoonCaptionSubmissions(cartoonCaptionData) {
    cy.validateCartoonCaptionSubmissions(cartoonCaptionData)
}

export function validateCartoonCaptionRating(cartoonCaptionData) {
    cy.validateCartoonCaptionRating(cartoonCaptionData)
}

export function validateCartoonCaptionVoting(cartoonCaptionData) {
    cy.validateCartoonCaptionVoting(cartoonCaptionData)
}

export function validateCartoonCaptionDisplayWinner(cartoonCaptionData) {
    cy.validateCartoonCaptionDisplayWinner(cartoonCaptionData)
}

export function validateEventPage(eventData) {
    cy.validateEventPage(eventData)
}

export function getEventPageInfo(workFlowData, eventData, urlIndex) {
    workFlowData.url = utils.getPageUrl(workFlowData.brand, workFlowData.page, urlIndex);
    cy.visit(workFlowData.url, { retryOnStatusCodeFailure: true });
    workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, urlIndex);
    return dataHelper.getEventData(workFlowData, eventData, urlIndex).then((data) => {
        eventData = data;
        return eventData;
    })
}

export function validateMixedMediaCarousel(){
    cy.validateMixedMediaCarousel()
}
