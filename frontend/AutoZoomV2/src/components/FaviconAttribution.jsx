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
    </Box>
  );
}

export default FaviconAttribution;
