"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePreviewMarkdown = exports.writeSVG = exports.OUTPUT_PATH = void 0;
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const theme_1 = require("../const/theme");
exports.OUTPUT_PATH = './profile-summary-card-output/';
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
// If neither a branch or tag is available for the event type, the variable will not exist. https://docs.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables
const GITHUB_BRANCH = process.env.GITHUB_REF == undefined
    ? core.getInput('BRANCH_NAME', { required: false })
    : process.env.GITHUB_REF.split('/').pop();
const writeSVG = function (folder, filename, svgString) {
    const targetFolder = `${exports.OUTPUT_PATH}${folder}/`;
    (0, fs_1.mkdirSync)(targetFolder, { recursive: true });
    (0, fs_1.writeFileSync)(`${targetFolder}${filename}.svg`, svgString);
};
exports.writeSVG = writeSVG;
function getAllFileInFolder(folder) {
    const files = [];
    (0, fs_1.readdirSync)(folder).forEach(file => {
        files.push(file);
    });
    return files;
}
const generatePreviewMarkdown = function (isInGithubAction) {
    const targetFolder = `${exports.OUTPUT_PATH}`;
    let readmeContent = '';
    const urlPrefix = isInGithubAction
        ? `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/profile-summary-card-output`
        : `.`;
    // First, we generate preview readme for each theme
    for (const themeName of theme_1.ThemeMap.keys()) {
        generateThemePreviewReadme(urlPrefix, themeName);
    }
    readmeContent += `
# Theme Preview

Here are all cards with themes.
| :bell: | If only show Top Languages card here, then you maybe forgot to use [Personal access token](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) instead of GITHUB_TOKEN in workflow. |
| :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

`;
    for (const themeName of theme_1.ThemeMap.keys()) {
        readmeContent += `## [${themeName}](./${themeName}/README.md)`;
        readmeContent += getThemeMarkdown(`${urlPrefix}/${themeName}`);
    }
    (0, fs_1.writeFileSync)(`${targetFolder}README.md`, readmeContent);
};
exports.generatePreviewMarkdown = generatePreviewMarkdown;
function generateThemePreviewReadme(urlPrefix, themeName) {
    let themePreviewMarkdown = '';
    themePreviewMarkdown += `## ${themeName}`;
    themePreviewMarkdown += `\n`;
    themePreviewMarkdown += getThemeMarkdown('.');
    themePreviewMarkdown += '### Now you can add this to your markdown';
    themePreviewMarkdown += `
\`\`\`
${getThemeMarkdown(`${urlPrefix}/${themeName}`)}
\`\`\`
`;
    themePreviewMarkdown += `\n`;
    themePreviewMarkdown += `### Each card usage`;
    for (const file of getAllFileInFolder(exports.OUTPUT_PATH + themeName)) {
        if (!file.endsWith('svg'))
            continue;
        themePreviewMarkdown += `
---

![](./${file})

\`\`\`
![](${urlPrefix}/${themeName}/${file})
\`\`\`

    `;
        themePreviewMarkdown += `\n`;
    }
    (0, fs_1.writeFileSync)(`${exports.OUTPUT_PATH}${themeName}/README.md`, themePreviewMarkdown);
}
function getThemeMarkdown(urlPrefix) {
    let result = '';
    result += `
[![](${urlPrefix}/0-profile-details.svg)](https://github.com/vn7n24fzkq/github-profile-summary-cards)
[![](${urlPrefix}/1-repos-per-language.svg)](https://github.com/vn7n24fzkq/github-profile-summary-cards) [![](${urlPrefix}/2-most-commit-language.svg)](https://github.com/vn7n24fzkq/github-profile-summary-cards)
[![](${urlPrefix}/3-stats.svg)](https://github.com/vn7n24fzkq/github-profile-summary-cards) [![](${urlPrefix}/4-productive-time.svg)](https://github.com/vn7n24fzkq/github-profile-summary-cards)
`;
    return result;
}
