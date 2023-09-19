import { Box, Link } from "@chakra-ui/react";

function FaviconAttribution() {
  return (
    <Box as="footer" color={"#FCB72B"}>
      <p>
        Favicon by{" "}
        <Link href="https://icons8.com" isExternal>
          Icons8
        </Link>
      </p>
      <p style={{ opacity: 0.05 }}>Daniel Edri</p>
    </Box>
  );
}

export default FaviconAttribution;
