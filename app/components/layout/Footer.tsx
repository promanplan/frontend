import { Box, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import siteConfig from '@/data/config'

export const Footer = () => {
  return (
    <Box as="footer" py={10} bg="gray.50">
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
          >
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                <siteConfig.logo />
              </Text>
              <Text color="gray.600" fontSize="sm">
                Generate and manage your project documentation efficiently
              </Text>
            </Box>
            
            <HStack spacing={8} wrap="wrap">
              <Link href="/#features">Features</Link>
              <Link href="/bpmn-viewer">BPMN Viewer</Link>
              <Link href="/document">Document</Link>
              <Link href="/create-project">Create Project</Link>
            </HStack>
          </Flex>
          
          <Flex 
            justifyContent="space-between" 
            alignItems="center"
            direction={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <Text fontSize="sm" color="gray.500">
              {siteConfig.footer.copyright}
            </Text>
            
            <HStack spacing={4}>
              {siteConfig.footer.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.700' }}
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
} 