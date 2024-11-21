import { Button, chakra, Text } from "@chakra-ui/react";

export const CustomButton = (props) => {
    const {
      variant = "primary",
      width = "auto",
      bg = variant === "primary"
        ? "#50B7F0"
        : variant === "label"
          ? "theme.brown.100"
          : 'transparent',
      color = variant === "primary"
        ? "#FFF"
        : variant === "label"
          ? "theme.gray.500"
          : variant === "light"
            ? "theme.text.primaryDark"
            : "theme.white",
      padding = "0px 20px",
      fontWeight = 700,
      fontSize = "16px",
      height = "47px",
      borderRadius = "12px",
      text = "",
      border = variant === "label" ? "1px solid" : 0,
      borderColor = variant === "label" ? "theme.brown.100" : "transparent",
      onClick = () => null,
      startadornicon = null,
      endadornicon = null,
      textProps = {}
    } = props;
    const StyledBtn = chakra(Button, {
      baseStyle: {
        height: height,
        width: width,
        backgroundColor: bg,
        color: color,
        padding: padding,
        borderRadius: borderRadius,
        fontWeight: fontWeight,
        fontSize: fontSize,
        border: border,
        borderColor: borderColor,
      },
    });
    return (
      <StyledBtn
        display={"flex"}
        alignItems={"center"}
        {...props}
        onClick={onClick}
      >
        {startadornicon}
        {
          text && text.length > 0 && (
            <Text
              {...textProps}
            >
              {text}
            </Text>
          )
        }
        {endadornicon}
      </StyledBtn>
    );
  };