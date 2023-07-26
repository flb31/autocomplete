import { highlightText } from "../components/AutoComplete/util";
describe("Util functions", () => {
  test("highlightText", () => {
    const text = "Iphone 11";
    const query = "pho";
    const result = highlightText(text, query);
    expect(result).toBe("I<b>pho</b>ne 11");
  });
});
