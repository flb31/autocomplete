import { memo } from "react";
import { AutoCompleteStyled } from "./styles";
import { AutoCompleteOption } from "./types";
import useAutoComplete from "./useAutoComplete";
import Effects from "./effects";
import { highlightText } from "./util";

const { Input, Wrapper, OptionsWrapper, Option } = AutoCompleteStyled;

const AutoComplete: React.FC<{
  onFetch: (value: string) => Promise<AutoCompleteOption[]>;
  limitOptions?: number;
  placeholder: string;
}> = ({ onFetch, limitOptions = 10, placeholder }) => {
  const {
    handleKeys,
    handleIndexOptions,
    handleScroll,
    handleFetch,
    resetFetch,
    onSelectOption,
    options,
    showOptions,
    value,
    loading,
    setValue,
    setShowOptions,
  } = useAutoComplete(onFetch, limitOptions);

  return (
    <>
      <Effects handleScroll={handleScroll} options={options} />
      <Wrapper>
        <Input
          data-testid="autocomplete"
          type="text"
          autoComplete="off"
          onKeyDown={handleIndexOptions}
          onClick={() => {
            handleFetch(value);
          }}
          onBlur={() => {
            setTimeout(() => {
              resetFetch();
              setShowOptions(false);
            }, 100);
          }}
          onChange={e => setValue(e.target.value)}
          onKeyUp={handleKeys}
          value={value}
          placeholder={placeholder ?? "Search..."}
        />
        {showOptions && (loading || options.length) ? (
          <OptionsWrapper>
            {loading ? (
              <Option>Searching...</Option>
            ) : (
              <MemoizedOption
                options={options}
                onSelectOption={onSelectOption}
                setValue={setValue}
                value={value}
              />
            )}
          </OptionsWrapper>
        ) : null}
      </Wrapper>
    </>
  );
};

const Options = ({ options, onSelectOption, setValue, value }) =>
  options.map((option: AutoCompleteOption) => (
    <Option
      onMouseOver={() => onSelectOption(option, true)}
      onMouseLeave={() => onSelectOption(option, false)}
      onClick={() => {
        setValue(option.name);
      }}
      key={option.value}
      selected={option.selected}
      aria-selected={option.selected}
      role="option"
      dangerouslySetInnerHTML={{ __html: highlightText(option.name, value) }}
    />
  ));

const MemoizedOption = memo(Options);

export default AutoComplete;
