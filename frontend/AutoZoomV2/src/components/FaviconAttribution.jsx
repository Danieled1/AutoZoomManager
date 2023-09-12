import { Box, Link } from "@chakra-ui/react";

function FaviconAttribution() {
  return (
    <Box as="footer">
      <p>
        Favicon by{" "}
        <Link href="https://icons8.com" isExternal>
          Icons8
        </Link>
      </p>
      <p style={{ opacity: 0.2 }}>Changil™</p>
    </Box>
  );
}

export default FaviconAttribution;
