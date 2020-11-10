const fs = require("fs");
const root = process.cwd();

/****************************************************
 Build Home Page
****************************************************/
async function getHome() {
  const pages = await getPages();
  const home = await createHomePage(pages);
  return home;
}

async function getPages(path = root) {
  const files = await fs.promises.readdir(path);

  const examples = await Promise.all(
    files
      .filter((file) => !file.includes("node_modules") && !file.startsWith("."))
      .map(async (file) => {
        const subpath = path + "/" + file;
        if (fs.lstatSync(subpath).isDirectory()) return getPages(subpath);
        if (file.endsWith(".html")) return subpath;
        return null;
      })
  );

  return flatten(examples).filter((file) => !!file);
}

function flatten(arr, acc = []) {
  for (const entry of arr)
    if (Array.isArray(entry)) flatten(entry, acc);
    else acc.push(entry);

  return acc;
}

async function createHomePage(files) {
  const template = await fs.promises.readFile(`${root}/.internal/home.html`, {
    encoding: "utf-8",
  });
  const flag = "<!--CONTENT-->";
  const [top, bottom] = template.split(flag);
  const content = files.map(createItem).join("");

  return top + flag + content + bottom;
}

function createItem(path) {
  const href = path.replace(root, "");
  const title = titleCase(
    href
      .replace("/", "")
      .replace(/\/index.html/i, "")
      .replace(/-/g, " ")
  );

  return `<li><a href="${href}"> ${title} <a/></li>`;
}

function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++)
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);

  return str.join(" ");
}

module.exports = { getHome, getPages };
