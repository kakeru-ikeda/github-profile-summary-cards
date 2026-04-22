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
exports.getRepoLanguages = exports.RepoLanguages = exports.RepoLanguageInfo = void 0;
const request_1 = __importDefault(require("../utils/request"));
class RepoLanguageInfo {
    constructor(name, color = '#586e75', count) {
        this.name = name;
        this.color = color;
        this.count = count;
    }
}
exports.RepoLanguageInfo = RepoLanguageInfo;
class RepoLanguages {
    constructor() {
        this.languageMap = new Map();
    }
    addLanguage(name, color) {
        if (this.languageMap.has(name)) {
            const lang = this.languageMap.get(name);
            lang.count += 1;
            this.languageMap.set(name, lang);
        }
        else {
            this.languageMap.set(name, new RepoLanguageInfo(name, color, 1));
        }
    }
    getLanguageMap() {
        return this.languageMap;
    }
}
exports.RepoLanguages = RepoLanguages;
const fetcher = (token, variables) => {
    // contain private repo need token permission
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query ReposPerLanguage($login: String!,$endCursor: String) {
        user(login: $login) {
          repositories(isFork: false, first: 100, after: $endCursor,ownerAffiliations: OWNER) {
            nodes {
              primaryLanguage {
                name
                color
              }
            }
            pageInfo{
                endCursor
                hasNextPage
            }
          }
        }
      }
      `,
        variables
    });
};
// repos per language
function getRepoLanguages(username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        let hasNextPage = true;
        let cursor = null;
        const repoLanguages = new RepoLanguages();
        const nodes = [];
        while (hasNextPage) {
            const res = yield fetcher(token, {
                login: username,
                endCursor: cursor
            });
            if (res.data.errors) {
                throw Error(res.data.errors[0].message || 'GetRepoLanguage fail');
            }
            cursor = res.data.data.user.repositories.pageInfo.endCursor;
            hasNextPage = res.data.data.user.repositories.pageInfo.hasNextPage;
            nodes.push(...res.data.data.user.repositories.nodes);
        }
        nodes.forEach(node => {
            if (node.primaryLanguage) {
                const langName = node.primaryLanguage.name;
                const langColor = node.primaryLanguage.color;
                if (!exclude.includes(langName.toLowerCase())) {
                    repoLanguages.addLanguage(langName, langColor);
                }
            }
        });
        return repoLanguages;
    });
}
exports.getRepoLanguages = getRepoLanguages;
