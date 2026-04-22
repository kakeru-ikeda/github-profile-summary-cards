"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitLanguage = exports.CommitLanguages = exports.CommitLanguageInfo = void 0;
const request_1 = __importDefault(require("../utils/request"));
class CommitLanguageInfo {
    constructor(name, color = '#586e75', count) {
        this.name = name;
        this.color = color;
        this.count = count;
    }
}
exports.CommitLanguageInfo = CommitLanguageInfo;
class CommitLanguages {
    constructor() {
        this.languageMap = new Map();
    }
    addLanguageCount(name, color, count) {
        if (this.languageMap.has(name)) {
            const lang = this.languageMap.get(name);
            lang.count += count;
            this.languageMap.set(name, lang);
        }
        else {
            this.languageMap.set(name, new CommitLanguageInfo(name, color, count));
        }
    }
    getLanguageMap() {
        return this.languageMap;
    }
}
exports.CommitLanguages = CommitLanguages;
const fetcher = (token, variables) => {
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query CommitLanguages($login: String!) {
        user(login: $login) {
          contributionsCollection {
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                primaryLanguage {
                  name
                  color
                }
              }
              contributions {
                  totalCount
              }
            }
          }
        }
      }
      `,
        variables
    });
};
// repos per language
function getCommitLanguage(username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const commitLanguages = new CommitLanguages();
        const res = yield fetcher(token, {
            login: username
        });
        if (res.data.errors) {
            throw Error(res.data.errors[0].message || 'GetCommitLanguage failed');
        }
        res.data.data.user.contributionsCollection.commitContributionsByRepository.forEach((node) => {
            if (node.repository.primaryLanguage == null) {
                return;
            }
            const langName = node.repository.primaryLanguage.name;
            const langColor = node.repository.primaryLanguage.color;
            const totalCount = node.contributions.totalCount;
            if (!exclude.includes(langName.toLowerCase())) {
                commitLanguages.addLanguageCount(langName, langColor, totalCount);
            }
        });
        return commitLanguages;
    });
}
exports.getCommitLanguage = getCommitLanguage;
