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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const analytics_1 = require("./utils/analytics");
const profile_details_card_1 = require("./cards/profile-details-card");
const repos_per_language_card_1 = require("./cards/repos-per-language-card");
const most_commit_language_card_1 = require("./cards/most-commit-language-card");
const stats_card_1 = require("./cards/stats-card");
const productive_time_card_1 = require("./cards/productive-time-card");
const child_process_1 = require("child_process");
const translator_1 = require("./utils/translator");
const file_writer_1 = require("./utils/file-writer");
const execCmd = (cmd, args = []) => new Promise((resolve, reject) => {
    const app = (0, child_process_1.spawn)(cmd, args, { stdio: 'pipe' });
    let stdout = '';
    app.stdout.on('data', data => {
        stdout = data;
    });
    app.on('close', code => {
        if (code !== 0 && !stdout.includes('nothing to commit')) {
            const err = new Error(`${cmd} ${args} \n ${stdout} \n Invalid status code: ${code}`);
            return reject(err);
        }
        return resolve(code);
    });
    app.on('error', reject);
});
// ProfileSummaryCardsTemplate
const commitFile = () => __awaiter(void 0, void 0, void 0, function* () {
    yield execCmd('git', ['config', '--global', 'user.email', 'profile-summary-cards-bot@example.com']);
    yield execCmd('git', ['config', '--global', 'user.name', 'profile-summary-cards[bot]']);
    yield execCmd('git', ['add', file_writer_1.OUTPUT_PATH]);
    yield execCmd('git', ['commit', '-m', 'Generate profile summary cards']);
    yield execCmd('git', ['push']);
});
// main
const action = () => __awaiter(void 0, void 0, void 0, function* () {
    core.info(`Start...`);
    if (!process.env.GITHUB_TOKEN) {
        core.setFailed('GITHUB_TOKEN is missing. Please check your workflow configuration.');
        return;
    }
    const username = core.getInput('USERNAME', { required: true });
    core.info(`Username: ${username}`);
    const utcOffset = Number(core.getInput('UTC_OFFSET', { required: false }));
    core.info(`UTC offset: ${utcOffset}`);
    const exclude = core.getInput('EXCLUDE', { required: false }).split(',');
    core.info(`Excluded languages: ${exclude}`);
    const autoPush = core.getBooleanInput('AUTO_PUSH', { required: false });
    core.info(`You ${autoPush ? 'have' : "haven't"} set automatically push commits`);
    try {
        // Remove old output
        core.info(`Remove old cards...`);
        yield execCmd('sudo', ['rm', '-rf', file_writer_1.OUTPUT_PATH]);
        // ProfileDetailsCard
        try {
            core.info(`Creating ProfileDetailsCard...`);
            yield (0, profile_details_card_1.createProfileDetailsCard)(username, process.env.GITHUB_TOKEN);
            yield (0, analytics_1.sendAnalytics)('action-profile-details-card', { username });
        }
        catch (error) {
            core.error(`Error when creating ProfileDetailsCard \n${error.stack}`);
        }
        // ReposPerLanguageCard
        try {
            core.info(`Creating ReposPerLanguageCard...`);
            yield (0, repos_per_language_card_1.createReposPerLanguageCard)(username, exclude, process.env.GITHUB_TOKEN);
        }
        catch (error) {
            core.error(`Error when creating ReposPerLanguageCard \n${error.stack}`);
        }
        // CommitsPerLanguageCard
        try {
            core.info(`Creating CommitsPerLanguageCard...`);
            yield (0, most_commit_language_card_1.createCommitsPerLanguageCard)(username, exclude, process.env.GITHUB_TOKEN);
        }
        catch (error) {
            core.error(`Error when creating CommitsPerLanguageCard \n${error.stack}`);
        }
        // StatsCard
        try {
            core.info(`Creating StatsCard...`);
            yield (0, stats_card_1.createStatsCard)(username, process.env.GITHUB_TOKEN);
        }
        catch (error) {
            core.error(`Error when creating StatsCard \n${error.stack}`);
        }
        // ProductiveTimeCard
        try {
            core.info(`Creating ProductiveTimeCard...`);
            yield (0, productive_time_card_1.createProductiveTimeCard)(username, utcOffset, process.env.GITHUB_TOKEN);
        }
        catch (error) {
            core.error(`Error when creating ProductiveTimeCard \n${error.stack}`);
        }
        // generate markdown
        try {
            core.info(`Creating preview markdown...`);
            (0, file_writer_1.generatePreviewMarkdown)(true);
        }
        catch (error) {
            core.error(`Error when creating preview markdown \n${error.stack}`);
        }
        // Commit changes
        if (autoPush) {
            core.info(`Commit file...`);
            let retry = 0;
            const maxRetry = 3;
            while (retry < maxRetry) {
                retry += 1;
                try {
                    yield commitFile();
                }
                catch (error) {
                    if (retry == maxRetry) {
                        throw error;
                    }
                    core.warning(`Commit failed. Retry...`);
                }
            }
        }
    }
    catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
});
const main = (username, utcOffset, exclude) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, profile_details_card_1.createProfileDetailsCard)(username, process.env.GITHUB_TOKEN);
        yield (0, repos_per_language_card_1.createReposPerLanguageCard)(username, exclude, process.env.GITHUB_TOKEN);
        yield (0, most_commit_language_card_1.createCommitsPerLanguageCard)(username, exclude, process.env.GITHUB_TOKEN);
        yield (0, stats_card_1.createStatsCard)(username, process.env.GITHUB_TOKEN);
        yield (0, productive_time_card_1.createProductiveTimeCard)(username, utcOffset, process.env.GITHUB_TOKEN);
        (0, file_writer_1.generatePreviewMarkdown)(false);
    }
    catch (error) {
        console.error(error);
    }
});
// program entry point
// check if run in github action
if (process.argv.length == 2) {
    action();
}
else {
    const username = process.argv[2];
    const utcOffset = Number(process.argv[3]);
    const exclude = [];
    if (process.argv[4]) {
        process.argv[4].split(',').forEach(function (val) {
            const translatedLanguage = (0, translator_1.translateLanguage)(val);
            exclude.push(translatedLanguage.toLowerCase());
        });
    }
    main(username, utcOffset, exclude);
}
