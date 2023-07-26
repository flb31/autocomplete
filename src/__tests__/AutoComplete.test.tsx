import AutoComplete from "../components/AutoComplete";
import * as service from "../services/dummyJson";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

const scrollSpy = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollSpy;

describe("AutoComplete Component", () => {
  beforeEach(() => {
    jest.spyOn(service, "dummyJson").mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(
            () =>
              resolve([
                { name: "test 1", value: "test1" },
                { name: "iPhone", value: "iphone" },
                { name: "test 3", value: "test3" },
                { name: "Android", value: "test4" },
                { name: "iPhone X", value: "iphone x" },
              ]),
            100
          );
        })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Make sure render correctly", () => {
    render(
      <AutoComplete onFetch={jest.fn()} placeholder="Search by something..." />
    );
    /**
     * Should be render the input and the wrapper
     */
    screen.getByTestId("autocomplete");
    screen.getByPlaceholderText("Search by something...");
  });

  test("Render the correct number of options and the correct text typed", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );
    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });

    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * Should be render the options
     */
    expect(input.getAttribute("value")).toBe("my search");
    expect(screen.getAllByRole("option").length).toBe(5);
  });

  test("First option should be selected by default", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );
    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });

    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * Should be render the first option selected
     */
    expect(screen.getByText("test 1").getAttribute("aria-selected")).toBe(
      "true"
    );
  });

  test("The options are not visible when the user didn't type", () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );
    const input = screen.getByTestId("autocomplete");
    fireEvent.focus(input);

    /**
     * Should't be render the options
     */
    expect(screen.queryAllByRole("option").length).toBe(0);
  });

  test("If blur the input, hide the options", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );
    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * First options are shown
     */
    expect(screen.queryAllByRole("option").length).toBe(5);

    /**
     * Should't be render the options after blur
     */
    fireEvent.blur(input);
    await waitForElementToBeRemoved(() => screen.getByText("test 1"), {
      timeout: 1000,
    });
    expect(screen.queryAllByRole("option").length).toBe(0);
  });

  test("Render a loading when the options are loading", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });

    /**
     * should be render the loading
     */
    await waitFor(() => screen.getByText("Searching..."), { timeout: 2000 });
    await waitForElementToBeRemoved(() => screen.getByText("Searching..."), {
      timeout: 2000,
    });
  });

  test("Escape key should hide the options", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * Simulating escape key
     */
    fireEvent.keyUp(input, { key: "Escape", code: "Escape", charCode: 0 });
    expect(screen.queryAllByRole("option").length).toBe(0);
  });

  test("Limit the number of options with a prop", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
        limitOptions={2}
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * Should be render only 2 options
     */
    expect(screen.queryAllByRole("option").length).toBe(2);
  });

  test("Selecting the option when the user press enter and hide then options", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    // Text typed
    expect(input.getAttribute("value")).toBe("my search");

    // Select the first option
    fireEvent.keyUp(input, {
      key: "ArrowDown",
      code: "ArrowDown",
      charCode: 0,
    });

    /**
     * should be render the first option selected after press enter
     */
    fireEvent.keyUp(input, { key: "Enter", code: "Enter", charCode: 0 });
    expect(input.getAttribute("value")).toBe("test 1");
    expect(screen.queryAllByRole("option").length).toBe(0);
  });

  test("Selecting the option when the user click on it and hide then options", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * should be render the first option selected after click on it
     */
    fireEvent.click(screen.getByText("test 1"));
    // Simulate after click on option blur the input
    fireEvent.blur(input);
    await waitForElementToBeRemoved(() => screen.getByText("test 1"), {
      timeout: 1000,
    });
    expect(input.getAttribute("value")).toBe("test 1");
    expect(screen.queryAllByRole("option").length).toBe(0);
  });

  test("Make sure highlight the matching part of the text", async () => {
    const { container } = render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "iph" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * should be render some options with the matching part of the text highlighted
     */
    expect(container.querySelectorAll("b").length).toBe(2);
  });

  test("Scrolling the options when the user press arrow down", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    // Press key down
    fireEvent.keyUp(input, {
      key: "ArrowDown",
      code: "ArrowDown",
      charCode: 0,
    });

    /**
     * Make sure the options are scrollable
     */
    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy).toHaveBeenCalledTimes(1);
  });

  test("Changing the background when the user hover an option", async () => {
    render(
      <AutoComplete
        onFetch={service.dummyJson}
        placeholder="Search by something..."
      />
    );

    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "my search" } });
    // Simulating key up event
    fireEvent.keyUp(input, { key: "a", code: "a", charCode: 65 });
    // Wait for the options
    await waitFor(() => screen.getByText("test 1"), { timeout: 3000 });

    /**
     * should change the background of the option is hovered
     */
    fireEvent.mouseOver(screen.getByText("test 3"));
    expect(screen.getByText("test 3").getAttribute("aria-selected")).toBe(
      "true"
    );
  });

  test.todo("Changing the background if the user select the option previously");
});
