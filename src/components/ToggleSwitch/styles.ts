import styled, { css } from 'styled-components'

export interface ToggleSwitchContainerProps {
  $toggled: boolean
}

export const ToggleSwitchContainer = styled.div<ToggleSwitchContainerProps>`
  width: 3.25rem;
  height: 1.5rem;
  margin: 0.5rem;
  border-radius: 1rem;

  display: flex;
  align-items: center;

  transition: background 0.5s;
  background-color: #e6e5e5;

  ${(props) => {
    if (props.$toggled)
      return css`
        background-color: #2196f3;
      `
  }}

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;
    border-radius: inherit;
    box-shadow: 0 1px 3px #272221;
    background-color: white;
    position: relative;

    cursor: pointer;
    transition:
      left 0.5s,
      color 0.5s;

    ${(props) =>
      props.$toggled
        ? css`
            left: 1.75rem;
          `
        : css`
            left: 0;
          `}

    svg {
      ${(props) =>
        props.$toggled
          ? css`
              color: #272221;
            `
          : css`
              color: #c47f17;
            `}
    }
  }
`
