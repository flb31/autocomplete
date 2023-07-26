import styled, { css } from "styled-components";

export const AutoCompleteStyled = {
  Wrapper: styled.div`
    width: 100%;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;

    > * {
      box-sizing: border-box;
    }
  `,

  Input: styled.input`
    font-size: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    width: 100%;
    border-radius: 5px;
  `,

  OptionsWrapper: styled.div`
    position: absolute;
    width: inherit;
    border: 1px solid #ccc;
    border-top: none;
    background-color: #fff;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
    max-height: 200px;
    border-radius: 0 0 5px 5px;
  `,

  Option: styled.button<{ selected?: boolean }>`
    padding: 10px;
    width: inherit;
    cursor: pointer;
    display: block;
    text-align: left;
    border: none;
    background-color: #fff;

    b {
      color: orange;
    }

    ${({ selected }) =>
      selected &&
      css`
        background-color: #ccc;
      `}
  `,
};
