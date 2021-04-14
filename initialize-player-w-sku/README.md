## Motivation

Threekit is frequently embedded into a 3rd-party platform, such as an ecommerce site, configure-price-quote, etc. These systems generally have detailed information about the product.

In this example, we will show how to use this product information to initialize the Threekit Player. This approach can simplify integration architecture by eliminating the need to sync ids between the two platforms.

### Initializing the Player with SKU

This is the absolute minimum required to initialize the Threekit Player.

```js
window.threekitPlayer({
  assetId: "00000000-0000-0000-0000-000000000000",
  authToken: "00000000-0000-0000-0000-000000000000",
  el: document.getElementById("player-el"),
});
```

As you can see, the assetId (i.e. the id of the record in Threekit) is always required. We cannot use the SKU directly but we can use the SKU to retrieve the `assetId` and then initialize the Player accordingly.

NOTE: Any global product identifier (not just a SKU) can be used.

### Step 0: Setup Item on Threekit

Before we begin, we must first make sure that there is a global product identifier (such as a SKU) that resides in Threekit. This information is stored in the Item's metadata.

<img src="https://i.imgur.com/La8NNY1.jpg" height="500px">

### Step 1: Query the Threekit Catalog

The first step is to query the [Threekit Catalog](https://docs.threekit.com/docs/en/catalog-api). This can be done directly from the browser.

This function will take a SKU and return the corresponding Threekit `assetId`.

```js
async function getAssetId(SKU) {
  const url =
    "https://admin.threekit.com/api/catalog/products" +
    `?bearer_token=${authToken}` +
    `&metadata=${JSON.stringify({ SKU })}` +
    `&orgId=${orgId}`;

  const tkProduct = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.products[0]);

  return tkProduct?.id;
}
```

### Step 2: Initialize Player

Here's how everything comes together. We retrieve the SKU from the URL parameters, query the Threekit Catalog, and use the id to initialize the Player.

```js
const authToken = "00000000-0000-0000-0000-000000000000";
const el = document.getElementById("player-el");
const orgId = "98b24b51-103f-4f86-8802-a791dd6f836a";

const searchParams = new URLSearchParams(window.location.search);
const sku = searchParams.get("sku");

async function getAssetId(SKU) {
  const url =
    "https://admin.threekit.com/api/catalog/products" +
    `?bearer_token=${authToken}` +
    `&metadata=${JSON.stringify({ SKU })}` +
    `&orgId=${orgId}`;

  const tkProduct = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.products[0]);

  return tkProduct?.id;
}

async function init(SKU) {
  const player = await window.threekitPlayer({
    assetId: await getAssetId(SKU),
    authToken,
    el,
  });
  window.player = player;
}

init(sku);
```
