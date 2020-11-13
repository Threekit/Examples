const { getPages } = require("./pages");
const fs = require("fs");

async function main() {
  const args = process.argv.slice(2);
  const authToken = args.find((arg) =>
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(
      arg
    )
  );

  try {
    if (!authToken) throw new Error("Invalid authToken");

    const files = await replaceTokens(authToken, await evalHasZeroToken());
    console.log(`Token update results:\n${files.join("\n")}`);
  } catch (error) {
    console.error(error);
  }
}

main();

async function evalHasZeroToken() {
  const paths = await getPages();

  const hasZeroTokens = await Promise.all(
    paths.map(async (path) => {
      const file = await fs.promises.readFile(path, {
        encoding: "utf-8",
      });

      return new RegExp("00000000-0000-0000-0000-000000000000", "g").test(file);
    })
  );

  return hasZeroTokens.some((rez) => !!rez);
}

async function replaceTokens(authToken, hasZeroToken) {
  // replaceTokensWReg is less stable.
  // So on initialization, we do a simple replace of zero tokens
  const replacer = hasZeroToken ? replaceZeroTokens : replaceTokensWReg;

  const paths = await getPages();
  return await Promise.all(
    paths.map(async (path) => {
      const file = await fs.promises.readFile(path, {
        encoding: "utf-8",
      });

      const update = replacer(file, authToken);

      try {
        await fs.promises.writeFile(path, update, "utf-8");
        return `SUCCESS: ${path}`;
      } catch (error) {
        return `FAILED: ${path}`;
      }
    })
  );
}

function replaceZeroTokens(file, authToken) {
  return file.replace(
    new RegExp("00000000-0000-0000-0000-000000000000", "g"),
    authToken
  );
}

function replaceTokensWReg(file, authToken) {
  return file
    .replace(
      new RegExp(`(const authToken \= \")(.*)(\")`, "g"),
      `$1${authToken}$3`
    )
    .replace(new RegExp(`(authToken: \")(.*)(\")`, "g"), `$1${authToken}$3`);
}
