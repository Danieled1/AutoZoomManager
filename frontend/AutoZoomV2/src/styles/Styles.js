export const app_styles = {
  box: {
    minH: "100vh",
    w: "100%",
    p: { base: 2, sm: 3, md: 4, lg: 5 },
    bg: "gray.200",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    scrollBehavior: "smooth",
  },
};
export const modal_styles = {
  modal_content: {
    bg: "gray.200",
    borderRadius: "md",
  },
  modal_header: {
    color: "teal.500",
    fontSize: { base: "md", sm: "lg", md: "xl", lg: "xl", xl: "xl" },
  },
  modal_body: {
    overflowX: "auto",
    p: { base: 1, sm: 2, md: 3, lg: 4, xl: 4 },
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
      /* Add spacing and padding */
      marginBottom: "5px",
      padding: "5px",
      /* Add background color on hover */
      transition: "background-color 0.2s ease",
    },
    ".row:hover": {
      backgroundColor: "#f5f5f5",
    },
    ".truncate": {
      /* Truncate text with ellipsis */
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      /* Add tooltip on hover */
      position: "relative",
    },
    ".truncate::after": {
      /* Style for the tooltip */
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
      /* Show the tooltip on hover */
      opacity: 1,
      visibility: "visible",
    },
  },
};

export const meeting_styles = {
  box: {
    bg: "white",
    p: { base: 2, sm: 4, md: 6, lg: 8, xl: 8 },
    borderRadius: "lg",
    shadow: "xl",
    maxW: {
      base: "80vw",
      sm: "60vw",
      md: "50vw",
      lg: "40vw",
      xl: "30vw",
    },
    w: "full",
    mb: 8,
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
    size: "md",
    color: "teal.500",
    mb: 4,
    fontSize: 24,
  },
  btn_box: {
    maxW: {
      base: "80vw",
      sm: "60vw",
      md: "50vw",
      lg: "40vw",
      xl: "30vw",
    },
    w: "full",
  },
  btn: {
    mb: 2,
    w: "full",
  },
};

export const header_styles = {
  heading: {
    size: { base: "lg", sm: "xl", md: "2xl", lg: "2xl", xl: "3xl" },
    color: "teal.500",
    mb: { base: 3, sm: 4, md: 5, lg: 5, xl: 5 },
  },
  span_box: {
    size: "xs",
    cursor: "text",
  },
  sub_header: {
    fontSize: { base: "sm", sm: "md", md: "lg", lg: "lg", xl: "xl" },
    textAlign: "center",
    mb: { base: 5, sm: 6, md: 8, lg: 10, xl: 10 },
  },
};
