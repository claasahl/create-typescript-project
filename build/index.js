#!/usr/bin/env node
"use strict";
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var git = __importStar(require("isomorphic-git"));
var chalk_1 = __importDefault(require("chalk"));
var jsonfile_1 = __importDefault(require("jsonfile"));
// the dir where we're doin stuff.
var dir = process.cwd();
var husky = {
  hooks: {
    "pre-commit": "pretty-quick --staged"
  }
};
var scripts = {
  prepare: "tsc",
  build: "tsc",
  start: "ts-node src/index.ts"
};
(function() {
  return __awaiter(_this, void 0, void 0, function() {
    var packageFile, packageJson, dest, res;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          git.plugins.set("fs", fs_1.default);
          return [4 /*yield*/, git.init({ dir: dir })];
        case 1:
          _a.sent();
          process.stdout.write(
            "Bootstrapping " + chalk_1.default.magenta("package.json") + " ... "
          );
          return [4 /*yield*/, execa_1.default("npm", ["init", "--yes"])];
        case 2:
          _a.sent();
          packageFile = path_1.default.resolve(dir, "package.json");
          return [4 /*yield*/, jsonfile_1.default.readFile(packageFile)];
        case 3:
          packageJson = _a.sent();
          packageJson.scripts = __assign({}, packageJson.scripts, scripts);
          return [
            4 /*yield*/,
            jsonfile_1.default.writeFile(
              packageFile,
              __assign({}, packageJson, { husky: husky })
            )
          ];
        case 4:
          _a.sent();
          process.stdout.write("Done\r\n");
          process.stdout.write(
            "Installing " + chalk_1.default.magenta("typescript") + " ... "
          );
          return [
            4 /*yield*/,
            execa_1.default("npm", [
              "install",
              "typescript",
              "@types/node",
              "ts-node",
              "--save-dev"
            ])
          ];
        case 5:
          _a.sent();
          return [
            4 /*yield*/,
            execa_1.default("tsc", ["--init", "--outDir", "build"])
          ];
        case 6:
          _a.sent();
          process.stdout.write("Done\r\n");
          process.stdout.write(
            "Installing " +
              chalk_1.default.magenta("prettier / pretty-quick") +
              " ... "
          );
          return [
            4 /*yield*/,
            execa_1.default("npm", [
              "install",
              "prettier",
              "pretty-quick",
              "husky",
              "--save-dev"
            ])
          ];
        case 7:
          _a.sent();
          process.stdout.write("Done\r\n");
          process.stdout.write(
            "Bootstrapping " + chalk_1.default.magenta(".gitignore") + " ... "
          );
          dest = fs_1.default.createWriteStream(".gitignore");
          return [
            4 /*yield*/,
            node_fetch_1.default("https://gitignore.io/api/node")
          ];
        case 8:
          res = _a.sent();
          dest.write("build/\r\n\r\n");
          res.body.pipe(dest);
          process.stdout.write("Done\r\n");
          process.stdout.write(
            "Bootstrapping " +
              chalk_1.default.magenta("'hello world'-sample") +
              " ... "
          );
          fs_1.default.mkdirSync(dir + "/src");
          fs_1.default.writeFileSync(
            dir + "/src/index.ts",
            '// happy coding 👻\r\nconsole.log("hello world");'
          );
          process.stdout.write("Done\r\n");
          process.stdout.write(
            "Staging " + chalk_1.default.magenta("files") + " ... "
          );
          return [4 /*yield*/, git.add({ dir: dir, filepath: ".gitignore" })];
        case 9:
          _a.sent();
          return [4 /*yield*/, git.add({ dir: dir, filepath: "package.json" })];
        case 10:
          _a.sent();
          return [
            4 /*yield*/,
            git.add({ dir: dir, filepath: "package-lock.json" })
          ];
        case 11:
          _a.sent();
          return [
            4 /*yield*/,
            git.add({ dir: dir, filepath: "tsconfig.json" })
          ];
        case 12:
          _a.sent();
          return [4 /*yield*/, git.add({ dir: dir, filepath: "src/index.ts" })];
        case 13:
          _a.sent();
          process.stdout.write("Done\r\n");
          process.stdout.write("\r\nHappy hacking! 👽 👻 😃\r\n");
          return [2 /*return*/];
      }
    });
  });
})();
//# sourceMappingURL=index.js.map
