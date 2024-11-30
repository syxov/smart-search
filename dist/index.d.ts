interface Parameter<T> {
    values: T[];
    getSearchString?(value: T): string;
}
interface NavOption<T> {
    keywords: string[];
    parameters: Parameter<T>[];
}
interface SearchResult<T> {
    option: NavOption<T>;
    parameters: T[];
    score: number;
}
declare class SmartSearch<T> {
    #private;
    constructor(options: readonly NavOption<T>[]);
    search(query: string, n?: number): SearchResult<T>[];
}

export { type NavOption, type Parameter, type SearchResult, SmartSearch };
