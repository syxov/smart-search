import Fuse from "fuse.js";

export interface Parameter<T> {
  values: T[];
  getSearchString(value: T): string;
}

export interface NavOption<T> {
  title: string;
  parameters: Parameter<T>[];
}

export interface SearchResult<T> {
  option: NavOption<T>;
  parameters: T[];
  score: number;
}

export class SmartSearch<T> {
  readonly #options: readonly NavOption<T>[];

  constructor(options: readonly NavOption<T>[]) {
    this.#options = options;
  }

  search(query: string, n = 5) {
    return this.#findTopNavOptions(query.trim(), this.#options, n);
  }

  *#combinationGenerator(
    parameters: Parameter<T>[],
    prefix: T[] = [],
  ): Generator<T[]> {
    if (parameters.length === 0) {
      yield prefix;
    } else {
      const [firstParamSignal, ...restParams] = parameters;
      for (const value of firstParamSignal.values) {
        yield* this.#combinationGenerator(restParams, [...prefix, value]);
      }
    }
  }

  #findTopNavOptions(
    userInput: string,
    navOptions: readonly NavOption<T>[],
    topN: number,
  ): SearchResult<T>[] {
    const results: SearchResult<T>[] = [];

    for (const navOption of navOptions) {
      const generator = this.#combinationGenerator(navOption.parameters);

      for (const combination of generator) {
        const combinationString = [
          navOption.title,
          ...combination.map((value, index) => {
            const param = navOption.parameters[index];
            return param.getSearchString(value);
          }),
        ].join("");

        const options = {
          includeScore: true,
          threshold: 0.7,
          keys: ["combination"],
        };

        const fuse = new Fuse([{ combination: combinationString }], options);
        const result = fuse.search(userInput);

        if (result.length > 0) {
          results.push({
            option: navOption,
            parameters: combination,
            score: result[0].score!,
          });
        }
      }
    }

    results.sort((a, b) => a.score - b.score);

    return results.slice(0, topN);
  }
}
