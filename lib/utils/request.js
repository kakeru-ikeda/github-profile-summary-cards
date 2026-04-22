"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const retry_axios_1 = __importDefault(require("retry-axios"));
const axios_1 = __importDefault(require("axios"));
retry_axios_1.default.attach();
function request(header, data) {
    return (0, axios_1.default)({
        url: 'https://api.github.com/graphql',
        method: 'post',
        headers: header,
        data: data,
        raxConfig: {
            retry: 3,
            noResponseRetries: 3,
            retryDelay: 1000,
            backoffType: 'linear',
            httpMethodsToRetry: ['POST'],
            onRetryAttempt: err => {
                const cfg = retry_axios_1.default.getConfig(err);
                core_1.default.warning(err);
                core_1.default.warning(`Retry attempt #${cfg === null || cfg === void 0 ? void 0 : cfg.currentRetryAttempt}`);
            }
        }
    });
}
exports.default = request;
