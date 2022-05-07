import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    darkBlue: "rgb(0, 24, 53)",
    blue: "rgb(0, 112, 243)",
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  components: {
    Heading: {
      baseStyle: {
        letterSpacing: "-2.4px",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "12px",
      },
      variants: {
        solid: {
          fontFamily: "heading",
          fontWeight: "semi-bold",
          fontSize: "sm",
          // padding: "5px 20px",
        },
        blue: {
          fontFamily: "heading",
          fontWeight: "semi-bold",
          fontSize: "sm",
          backgroundColor: "brand.darkBlue",
          color: "brand.blue",
          padding: "5px 20px",
        },
        gradient: {
          backgroundImage:
            "linear-gradient(112deg, rgb(170, 255, 236) -63.59%, rgb(255, 78, 205) -20.3%, rgb(0, 112, 243) 70.46%)",
          color: "white",
          fontFamily: "heading",
          fontWeight: "semi-bold",
          fontSize: "sm",
          padding: "5px 20px",
          _hover: {
            opacity: 0.8,
          },
        },
      },
    },
  },
});

export default theme;
