import styled from "styled-components";

const Button = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  color: #000;
  border: 0;
  box-sizing: border-box;
  background: ${(props) => (props.bgColor ? props.bgColor : "#fff")};
`;

export default Button;
