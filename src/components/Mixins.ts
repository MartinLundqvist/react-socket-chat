import { css } from 'styled-components';

export const Shadows = css`
  border-radius: 50px;
  background-color: var(--color-bg);
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
`;

export const ShadowsMessageIn = css`
  border-radius: 25px 25px 25px 0;
  background-color: var(--color-bg);
  box-shadow: 10px 10px 15px #bebebe, -10px -10px 15px #ffffff;
`;
export const ShadowsMessageOut = css`
  border-radius: 25px 25px 0 25px;
  background-color: var(--color-bg);
  box-shadow: 10px 10px 15px #bebebe, -10px -10px 15px #ffffff;
`;

/*
  border-radius: 50px;
  background: #7a665d;
  box-shadow: 20px 20px 60px #68574f, -20px -20px 60px #8c756b;
 */
