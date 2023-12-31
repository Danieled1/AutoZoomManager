import { Box } from "@chakra-ui/react";

{
  /* <Box ></Box> */
}
export const app_styles = {
  box: {
    minHeight: "100vh",
    width: "100%",
    padding: { base: 2, sm: 3, md: 4, lg: 5 },
    background: "#fffae5",
    animation: "gradientAnimation 40s ease-in-out infinite",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    scrollBehavior: "smooth",
    fontFamily: "'Roboto', sans-serif",
    cursor: "default",
    transition: "all 0.2s ease",
    animation: "fadeInAnimation ease-in 1s",
    animationIterationCount: "1",
    animationFillMode: "backwards",
  },
};
const keyframes = `
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    10% { background-position: 100% 0%; }
    20% { background-position: 50% 100%; }
    30% { background-position: 100% 100%; }
    40% { background-position: 0% 0%; }
    50% { background-position: 100% 50%; }
    60% { background-position: 50% 0%; }
    70% { background-position: 100% 100%; }
    80% { background-position: 0% 100%; }
    90% { background-position: 0% 0%; }
    100% { background-position: 100% 50%; }
  }
  @keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

// Need to change the props to camal case
export const modalStyles = {
  modal_content: {
    backgroundColor: "gray.200",
    borderRadius: "md",
  },
  modal_header: {
    color: "#6836FF",
    fontSize: { base: "md", sm: "lg", md: "xl", lg: "xl", xl: "xl" },
  },
  modal_body: {
    overflowX: "auto",
    padding: { base: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  },
  primary_color: {
    color: "#6836FF",
  },
  secondary_color: {
    color: "gray.500",
  },
  table: {
    variant: "simple",
    size: "lg",
    "Tr>Th": {
      color: "#6836FF",
    },
    ".row": {
      marginBottom: "5px",
      padding: "5px",
      transition: "background-color 0.2s ease",
    },
    ".row:hover": {
      backgroundColor: "#f5f5f5",
    },
    ".truncate": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      position: "relative",
    },
    ".truncate::after": {
      content: "attr(title)",
      position: "absolute",
      backgroundColor: "#333",
      color: "#fff",
      padding: "5px",
      borderRadius: "3px",
      whiteSpace: "nowrap",
      zIndex: 1,
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      opacity: 0,
      visibility: "hidden",
      transition: "opacity 0.2s ease, visibility 0.2s ease",
    },
    ".truncate:hover::after": {
      opacity: 1,
      visibility: "visible",
    },
  },
  input: {
    outline: "none",
    focusBorderColor: "purple.500", // for focus border color
    _focus: {
      boxShadow: "0 0 0 2px var(--chakra-colors-purple-500)", // for focus shadow
    },
  },
};

export const meeting_styles = {
  box: {
    backgroundColor: "white",
    padding: { base: 2, sm: 4, md: 6, lg: 8, xl: 8 },
    borderRadius: "2xl",
    boxShadow:
      "0px 12px 28px 0px rgba(0, 0, 0, 0.2), 0px 2px 4px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(255, 255, 255, 0.05) inset",
    maxWidth: {
      base: "80vw",
      sm: "60vw",
      md: "50vw",
      lg: "40vw",
      xl: "30vw",
    },
    width: "full",
    marginBottom: 8,
    alignSelf: "center",
  },
  stack: {
    spacing: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    ".labels": {
      fontSize: "xl",
      fontWeight: "bold",
    },
  },
  heading: {
    fontSize: "md",
    fontWeight: "500",
    // borderBottom: "solid",
    borderBottomWidth: "3px",
    letterSpacing: "0.8px",
    color: "blackAlpha",
    paddingBottom: 2,
    marginBottom: 3,
    fontSize: 26,
  },
  btn_box: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    maxWidth: {
      base: "80vw",
      sm: "60vw",
      md: "50vw",
      lg: "40vw",
      xl: "30vw",
    },
    width: "100%",
    marginBottom: "10px",
  },
  btn: {
    width: "full",
    px: 4,
    py: 2,
    color: "white",
    letterSpacing: "1px",
    backgroundColor: "#6836FF",
  },
  btn_alternate: {
    width: "full",
    px: 4,
    py: 2,
    color: "black",
    letterSpacing: "1px",
    backgroundColor: "#FCB72B",
  },
  input: {
    borderColor: "#522CCC",
    _hover: {
      borderColor: "#522CCC",
    },
    _focus: {
      borderColor: "#522CCC",
      boxShadow: "0 0 0 1px #522CCC",
    },
  },
};
// #FCB72B
// #6836FF
export const header_styles = {
  heading: {
    fontSize: { base: "3xl", sm: "3xl", md: "3xl", lg: "4xl", xl: "6xl" },
    color: "#6836FF",
    marginBottom: { base: 3, sm: 4, md: 5, lg: 5, xl: 5 },
    display: "inline-block",
    padding: "0.5em 1em",
    width: "fit-content",
    position: "relative",
    _after: {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      height: "3px",
      width: "100%",
      backgroundImage:
        "linear-gradient(90deg, #6836FF 0%, #FFF1BA 50%, #6836FF 100%)",
      animation: "pulse 2.2s infinite alternate",
    },
    "@keyframes pulse": {
      "0%": { transform: "scaleX(0)" },
      "100%": { transform: "scaleX(0.9)" },
    },
  },
  waveEffect: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  sub_header: {
    fontSize: { base: "sm", sm: "md", md: "lg", lg: "lg", xl: "xl" },
    textAlign: "center",
    marginBottom: { base: 5, sm: 6, md: 8, lg: 10, xl: 10 },
    cursor: "default",
  },
};

const styleTag = document.createElement("style");
styleTag.textContent = keyframes;
document.head.appendChild(styleTag);
