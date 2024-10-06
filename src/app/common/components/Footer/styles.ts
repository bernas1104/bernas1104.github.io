import styled from 'styled-components'

export const FooterContainer = styled.footer`
  margin-top: auto;

  width: 100%;
  color: ${(props) => props.theme['gray-100']};
  background-color: ${(props) => props.theme['gray-blue-300']};

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  gap: 2rem;
`
