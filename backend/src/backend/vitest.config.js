"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const vitest_config_base_1 = __importDefault(require("../vitest.config.base"));
const path_1 = __importDefault(require("path"));
exports.default = (0, config_1.mergeConfig)(vitest_config_base_1.default, (0, config_1.defineConfig)({
    resolve: {
        alias: {
            src: path_1.default.resolve(__dirname, "./src"),
        },
    },
    test: {
        setupFiles: "./src/tests/setup.ts",
        include: ["src/tests/**/*.{test,spec,int-spec}.{ts,tsx}"],
    }
}));
//# sourceMappingURL=vitest.config.js.map