#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
var pdf = require("docusaurus-pdf/lib");
const docs_dir = process.env.DOCS_OUTPUT || "build_docs/RancherCNDocsPDF";

var docs = {
    harverster: {
        filename: "Harvester.pdf",
    },
    k3s: {
        filename: "K3s.pdf",
    },
    octopus: {
        index: "/about/_index/",
        filename: "Octopus_CN_Doc.pdf",
    },
    rancher1: {
        filename: "rancher1.6.pdf",
    },
    rancher2: {
        filename: "Rancher2.x_CN_Doc.pdf",
    },
    rke: {
        filename: "rke.pdf",
    },
};

fs.mkdirSync(docs_dir, (options = { recursive: true }));

var pdfCacheId = "";
Object.keys(require.cache).forEach((k) => {
    if (k.includes("docusaurus-pdf/lib")) {
        pdfCacheId = k;
    }
});

var p = Promise.resolve();

fs.readdirSync("docs").forEach((dirname) => {
    var config = docs[dirname] || {};
    var index = config["index"] || "/_index/";
    var url = "/docs/" + dirname + index;
    var filename = config["filename"] || dirname + ".pdf";
    filename = docs_dir + "/" + filename;
    p = p
        .then(async () => {
            try {
                delete require.cache[pdfCacheId];
                pdf = require("docusaurus-pdf/lib");
                const res = await pdf.generatePdfFromBuildSources(
                    "./build/",
                    url,
                    "",
                    filename
                );
                console.log("pdf generated for", filename);
            } catch (err) {
                throw err;
            }
        })
        .catch((err) => {
            console.log(
                chalk.red("failed to generate pdf", filename, ",", err)
            );
            process.exit(1);
        });
});
