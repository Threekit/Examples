const { getHome } = require("./.internal/pages");
const express = require("express");

/****************************************************
 A domain is required to initialize the Threekit Player, thus
 we use a simple server to develop locally.
****************************************************/

async function start() {
  const PORT = process.env.PORT || 8080;

  try {
    const app = express();

    app.use("/", async (req, res, next) =>
      req.path === "/"
        ? res.send(await getHome())
        : express.static(process.cwd())(req, res, next)
    );

    app.listen(PORT, () => {
      console.log(`Threekit Examples on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();
