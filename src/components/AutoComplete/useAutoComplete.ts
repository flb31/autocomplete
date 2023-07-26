import { useCallback, useState } from "react";
import { AutoCompleteOption } from "./types";
import { debounce } from "lodash";

const keysDisableForFetch = [
  "Escape",
  "Enter",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "NumLock",
  "ScrollLock",
  "Pause",
  "Insert",
  "Home",
  "PageUp",
  "End",
  "PageDown",
  "ContextMenu",
  "PrintScreen",
  "ScrollLock",
];

const useAutoComplete = (
  onFetch: (query: string) => Promise<AutoCompleteOption[]>,
  limitOptions?: number
) => {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState<string>("");
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedFetch = useCallback(
    debounce((query: string) => {
      handleFetch(query);
    }, 1000),
    []
  );

  const handleIndexOptions = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key) || !options.length) return;
    const newIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
    if (newIndex < 0 || newIndex + 1 > options.length) return;
    manageOptions(index, newIndex);
  };

  const manageOptions = useCallback(
    (index: number, newIndex: number) => {
      if (options[index]) options[index].selected = false;
      if (options[newIndex]) options[newIndex].selected = true;
      setIndex(newIndex);
      setOptions([...options]);
    },
    [options]
  );

  const onSelectOption = (
    option: AutoCompleteOption | undefined,
    selected: boolean
  ) => {
    if (!option) return;
    option.selected = selected;
    setOptions([...options]);
  };

  const handleScroll = () => {
    const element = document.querySelector("[aria-selected='true']");
    if (!element) return;
    element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  const handleKeys = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      resetFetch();
      return;
    }

    if (e.key === "Enter") {
      if (index >= 0) {
        setValue(options[index].name);
        resetFetch();
      }
      return;
    }

    if (!keysDisableForFetch.includes(e.key)) {
      if (!e.currentTarget.value) return resetFetch();
      debouncedFetch(e.currentTarget.value);
    }
  };

  const resetFetch = () => {
    setIndex(-1);
    setOptions([]);
    setShowOptions(false);
  };

  const handleFetch = async (query: string) => {
    if (!query) return resetFetch();
    setShowOptions(true);
    setLoading(true);
    const resOptions = await onFetch(query);
    const options = limitOptions
      ? resOptions.slice(0, limitOptions)
      : resOptions;

    // Select the first one by default
    if (options.length) {
      options[0].selected = true;
      setIndex(0);
    }

    setOptions(options);
    setLoading(false);
  };

  return {
    // Handlers
    handleKeys,
    handleIndexOptions,
    handleScroll,
    handleFetch,
    resetFetch,

    // Events
    onSelectOption,

    // States
    index,
    options,
    showOptions,
    value,
    loading,

    // Setters
    setIndex,
    setOptions,
    setShowOptions,
    setValue,
    setLoading,
  };
};

export default useAutoComplete;
