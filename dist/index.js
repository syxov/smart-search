"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SmartSearch: () => SmartSearch
});
module.exports = __toCommonJS(src_exports);
var import_fuse = __toESM(require("fuse.js"));
var import_heap = require("@datastructures-js/heap");
var SmartSearch = class {
  #options;
  constructor(options) {
    this.#options = options;
  }
  search(query, n = 5) {
    return this.#findTopNavOptions(query.trim(), this.#options, n);
  }
  *#combinationGenerator(parameters, prefix = []) {
    if (parameters.length === 0) {
      yield prefix;
    } else {
      const [firstParamSignal, ...restParams] = parameters;
      for (const value of firstParamSignal.values) {
        yield* this.#combinationGenerator(restParams, [...prefix, value]);
      }
    }
  }
  #findTopNavOptions(userInput, navOptions, topN) {
    const heap = new import_heap.MinHeap((val) => val.score);
    for (const navOption of navOptions) {
      const generator = this.#combinationGenerator(navOption.parameters);
      for (const keyword of navOption.keywords) {
        for (const combination of generator) {
          const combinationString = [
            keyword,
            ...combination.map((value, index) => {
              const param = navOption.parameters[index];
              return param.getSearchString?.(value) ?? value;
            })
          ].join("");
          const options = {
            includeScore: true,
            threshold: 0.7
          };
          const fuse = new import_fuse.default([combinationString], options);
          const result = fuse.search(userInput);
          if (result.length > 0) {
            const searchResult = {
              option: navOption,
              parameters: combination,
              score: result[0].score
            };
            if (heap.size() < topN) {
              heap.push(searchResult);
            } else if (heap.root().score < searchResult.score) {
              heap.extractRoot();
              heap.push(searchResult);
            }
          }
        }
      }
    }
    return heap.sort();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartSearch
});
//# sourceMappingURL=index.js.map