import { NavOption, SmartSearch } from "./index";

const testConfig = {
  title: "Test App",
  parameters: [],
};

const examples: {
  query: string;
  config: NavOption<unknown>[];
  results: NavOption<unknown>[];
}[] = [
  {
    query: "test",
    config: [testConfig],
    results: [testConfig],
  },
];

test("check", () => {
  for (const test of examples) {
    const searchResult = new SmartSearch(test.config)
      .search(test.query)
      .map((res) => res.option);
    for (const result of test.results) {
      expect(searchResult).toContain(result);
    }
  }
});
