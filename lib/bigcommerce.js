const request = require("request");



function handleBigcommerceResponse(
    func,
    error,
    response,
    body,
    resolve,
    reject
) {
    if (!response) {
        // can happen sometimes
        console.error(func, "(no response)");
        var e = new Error("empty response from Shopify");
        e.code = 410;
        reject(e);
    } else {
        if (error || (body && body.errors)) {
            var e = new Error(error || JSON.stringify(body.errors));
            e.code = response.statusCode;
            reject(e);
        } else if (response.statusCode == 429) {
            var e = new Error(response.statusMessage);
            e.code = response.statusCode;
            reject(e);
        } else if (response.statusCode >= 500) {
            var e = new Error(response.statusMessage);
            e.code = response.statusCode;
            reject(e);
        }
        // resolve(body)
        else {
            console.log(body);
            resolve({ body: body, link: response.headers["link"] });
        }
    }
}

async function BigcommerceProxy(proxy_for, accesstoken, url, bodydata, func) {
    console.log(accesstoken);
    return promiseRetry({ retries: 30, factor: 1.1 }, function (retry, number) {
        return proxy_for(accesstoken, url, bodydata, func).catch(function (e) {
            // 410 Gone
            // 429 Too Many Requests
            // 500 Internal Server Error
            // 502 Bad Gateway
            // 504 Gateway Timeout
            // 524 A Timeout Occurred (Cloudflare)
            if ([410, 429, 500, 502, 503, 504, 524].includes(e.code)) {
                console.log(
                    func,
                    e.code,
                    e.code == 429 ? "API limit reached" : e.message,
                    "- retrying (attempt",
                    number,
                    "of 30)"
                );
                retry(e);
            } else {
                console.error(func, e.code, url);
                throw e;
            }
        });
    }).then(
        function (resolve_value) {
            if (func == "getBigcommerceObjectList") return resolve_value;
            // only return both body and link header for this function
            else return resolve_value.body;
        },
        function (e) {
            console.error(func, e.code, e.message);
            throw e;
        }
    );
}


async function BigcommerceGet(accesstoken, url, bodydata, func) {
    console.log(accesstoken, url);
    return new Promise((resolve, reject) => {
        // console.log(url);
        console.log(url.startsWith("https://") ? url : "https://" + url, "............", "accesstoken", accesstoken);
        request.get(
            {
                url: url.startsWith("https://") ? url : "https://" + url,
                headers: { "X-Auth-Token": accesstoken },
                json: true,
            },
            function (error, response, body) {
                console.log(response)
                handleBigcommerceResponse(func, error, response, body, resolve, reject);
            }
        );
    });
}

async function BigcommercePost(accesstoken, url, bodydata, func) {
    console.log(accesstoken, url);
    return new Promise((resolve, reject) => {
        console.log(url.startsWith("https://") ? url : "https://" + url, "............", "accesstoken", accesstoken);
        request.post(
            {
                url: url.startsWith("https://") ? url : "https://" + url,
                headers: { "X-Auth-Token": accesstoken },
                json: true,
                body: bodydata,
            },
            function (error, response, body) {
                console.log(response)
                handleBigcommerceResponse(func, error, response, body, resolve, reject);
            }
        );
    });
}

async function BigcommercePut(accesstoken, url, bodydata, func) {
    console.log(accesstoken, url);
    return new Promise((resolve, reject) => {
        console.log(url.startsWith("https://") ? url : "https://" + url, "............", "accesstoken", accesstoken);
        request.put(
            {
                url: url.startsWith("https://") ? url : "https://" + url,
                headers: { "X-Auth-Token": accesstoken },
                json: true,
                body: bodydata,
            },
            function (error, response, body) {
                console.log(response)
                handleBigcommerceResponse(func, error, response, body, resolve, reject);
            }
        );
    });
}

async function BigcommerceDelete(accesstoken, url, func) {
    console.log(accesstoken, url);
    return new Promise((resolve, reject) => {
        console.log(url.startsWith("https://") ? url : "https://" + url, "............", "accesstoken", accesstoken);
        request.delete(
            {
                url: url.startsWith("https://") ? url : "https://" + url,
                headers: { "X-Auth-Token": accesstoken },
                json: true,
            },
            function (error, response, body) {
                console.log(response)
                handleBigcommerceResponse(func, error, response, body, resolve, reject);
            }
        );
    });
}

module.exports = getProduct = async (data) => {
    return BigcommerceProxy(
        BigcommerceGet,
        data.accesstoken,
        `https://api.bigcommerce.com/stores/k3nqjjyp43/v3/catalog/products`,
        "getProducts"
    ).then((body) => {
        return body;
    });
};

module.exports = createProduct = async (data, product_id, body) => {
    return BigcommerceProxy(
        BigcommercePost,
        data.accesstoken,
        `https://api.bigcommerce.com/stores/k3nqjjyp43/v3/catalog/products/${product_id}`,
        body,
        "createProduct"
    ).then((body) => {
        console.log(" body OptionValues-------------", body);
        return body;
    });
};

module.exports = updateProduct = async (data, product_id, body) => {
    return BigcommerceProxy(
        BigcommercePut,
        data.accesstoken,
        `https://api.bigcommerce.com/stores/k3nqjjyp43/v3/catalog/products/${product_id}`,
        body,
        "updateProduct"
    ).then((body) => {
        console.log(" body -------------", body);
        return body;
    });
};

module.exports = deleteProduct = async (data, product_id, body) => {
    return BigcommerceProxy(
        BigcommerceDelete,
        data.accesstoken,
        `https://api.bigcommerce.com/stores/k3nqjjyp43/v3/catalog/products/${product_id}`,
        body,
        "deleteProduct"
    ).then((body) => {
        console.log(" body -------------", body);
        return body;
    });
};


