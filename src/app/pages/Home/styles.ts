import styled from 'styled-components'

export const HomeContainer = styled.main`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2.5rem;
  border-radius: 0.5rem;

  color: ${(props) => props.theme['gray-100']};
  background-color: ${(props) => props.theme['gray-blue-300']};

  line-height: 1.6;
  font-family: 'Press Start 2P', cursive;
`
