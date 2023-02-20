const puppeteer = require("puppeteer");
const path = require("path");
const generate = require("./generate")
const log4js = require("log4js");

const render = async(scriptHtml) => {
  try{
  let pdf = scriptHtml;
  randomchar = generate.randomkarakter();
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disabled-setupid-sandbox", "--use-gl=egl"],
    headless: true,
  });
  page = await browser.newPage();
  await page.setContent(pdf);
  buffer = await page.pdf({
    path: "./src/public/storeone/expenrender_" + randomchar + ".pdf",
    // paperWidth:8.5,
    // paperHeight:13,
    format: "Legal",
    printBackground: true,
    margin: {
      left: "0px",
      top: "0px",
      right: "0px",
      bottom: "0px",
    },
  });
  return "expenrender_" + randomchar + ".pdf"
}catch(err){
  log4js.getLogger().debug(err);
  return null
}
}

const renderkirim = async(scriptHtml,sifat_surat,id_trx,nomor_surat,perihal,tanggal_surat,nip_pembuat,nip_penandatangan,tahun) => {
  try{
            let filename = await render(scriptHtml);
            let pathpdf = path.join(
              __dirname,
              "../public/storeone/",
              "/" + filename
            );
            generate.kirimpanutan(
              pathpdf,
              filename,
              sifat_surat,
              id_trx,
              nomor_surat,
              perihal,
              tanggal_surat,
              nip_pembuat,
              nip_penandatangan,
              tahun
            );
            return null
  }catch(err){
    log4js.getLogger().debug(err);
    return null
  }
}

const generatePdf = async (scriptHtml, name) => {
  try {
    let pdf = scriptHtml;
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disabled-setupid-sandbox", "--use-gl=egl"],
      headless: true,
    });
    page = await browser.newPage();
    await page.setContent(pdf);
    buffer = await page.pdf({
      path: `./src/public/surattugas/${name}/dokumen-${name}.pdf`,
      format: "Legal",
      printBackground: true,
      margin: {
        left: "0px",
        top: "0px",
        right: "0px",
        bottom: "0px",
      },
    });
    return `dokumen-${name}.pdf`;
  } catch (err) {
    log4js.getLogger().debug(err);
    return null;
  }
};

module.exports = { render, renderkirim, generatePdf };
