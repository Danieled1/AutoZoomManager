export const app_styles = {
  box: {
    minHeight: "100vh",
    width: "100%",
    padding: { base: 2, sm: 3, md: 4, lg: 5 },
    background: "linear-gradient(45deg, #6BC5E3, #ACD7EF, #E7F0FF)",
    animation: "gradientAnimation 40s ease-in-out infinite",    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    scrollBehavior: "smooth",
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
`;
export const modal_styles = {
  modal_content: {
    backgroundColor: "gray.200",
    borderRadius: "md",
  },
  modal_header: {
    color: "teal.500",
    fontSize: { base: "md", sm: "lg", md: "xl", lg: "xl", xl: "xl" },
  },
  modal_body: {
    overflowX: "auto",
    padding: { base: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  },
  primary_color: {
    color: "teal.500",
  },
  secondary_color: {
    color: "gray.500",
  },
  table: {
    variant: "simple",
    size: "lg",
    "Tr>Th": {
      color: "teal.500",
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
};

export const meeting_styles = {
  box: {
    backgroundColor: "white",
    padding: { base: 2, sm: 4, md: 6, lg: 8, xl: 8 },
    borderRadius: "lg",
    boxShadow: "xl",
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
    ".labels": {
      fontSize: "md",
      fontWeight: "bold",
    },
  },
  heading: {
    fontSize: "md",
    color: "teal.500",
    marginBottom: 4,
    fontSize: 24,
  },
  btn_box: {
    maxWidth: {
      base: "80vw",
      sm: "60vw",
      md: "50vw",
      lg: "40vw",
      xl: "30vw",
    },
    width: "full",
  },
  btn: {
    marginBottom: 2,
    width: "full",
  },
};

export const header_styles = {
  heading: {
    fontSize: { base: "3xl", sm: "3xl", md: "3xl", lg: "4xl", xl: "6xl" },
    color: "teal.500",
    marginBottom: { base: 3, sm: 4, md: 5, lg: 5, xl: 5 },
    display: "inline-block",
    padding: "0.5em 1em",
    width: "fit-content",
    position: "relative",
  },
  waveEffect: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  span_box: {
    cursor: "text",
  },
  sub_header: {
    fontSize: { base: "sm", sm: "md", md: "lg", lg: "lg", xl: "xl" },
    textAlign: "center",
    marginBottom: { base: 5, sm: 6, md: 8, lg: 10, xl: 10 },
  },
};


const styleTag = document.createElement("style");
styleTag.textContent = keyframes;
document.head.appendChild(styleTag);
