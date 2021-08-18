const fs = require("fs");
const path = require("path");
const { Extractor, ExtractorConfig } = require("@microsoft/api-extractor");

const projectRoot = path.join(__dirname, "..");

const publishedPackages = ["authgear-web", "authgear-react-native"];
const packages = ["authgear-core", ...publishedPackages];

const coreDtsPath = path.join(projectRoot, `packages/authgear-core/index.d.ts`);

// Generate index.d.ts
for (const p of packages) {
  const entrypoint = path.join(projectRoot, `packages/${p}/src/index.d.ts`);
  const configObject = ExtractorConfig.loadFile(
    path.join(projectRoot, "api-extractor.json")
  );
  configObject.mainEntryPointFilePath = entrypoint;
  configObject.projectFolder = path.join(projectRoot, `packages/${p}`);
  configObject.dtsRollup.enabled = true;
  configObject.dtsRollup.untrimmedFilePath = path.join(
    projectRoot,
    `packages/${p}/index.d.ts`
  );

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    packageJsonFullPath: path.join(projectRoot, `packages/${p}/package.json`),
  });

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (
    !extractorResult.succeeded ||
    extractorResult.errorCount > 0 ||
    extractorResult.warningCount > 0
  ) {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    );
    process.exit(1);
  }
}

// Concatenate index.d.ts
for (const p of publishedPackages) {
  const dtsPath = path.join(projectRoot, `packages/${p}/index.d.ts`);
  const lines = fs
    .readFileSync(dtsPath, { encoding: "utf8" })
    .split("\n")
    // Remove lines that reference @authgear/core
    // because we are going to inline its index.d.ts
    .filter(line => !/@authgear\/core/.test(line));
  const content =
    fs.readFileSync(coreDtsPath, { encoding: "utf8" }) + lines.join("\n");
  fs.writeFileSync(dtsPath, content);
}
