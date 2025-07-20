import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export const Hero = () => {
  return (
    <Box
      as="section"
      position="relative"
      h={{ base: 'auto', md: '100vh' }}
      maxH="900px"
      overflow="hidden"
      bg="blue.600"
      color="white"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blue.600"
        opacity="0.9"
        zIndex="1"
      />
      
      <Container maxW="container.xl" position="relative" zIndex="2" pt={{ base: '120px', md: '0' }}>
        <Flex
          align="center"
          direction={{ base: 'column', md: 'row' }}
          height={{ md: '100vh' }}
          maxH="900px"
          pt={{ base: '0', md: '80px' }}
          pb={{ base: '20', md: '0' }}
        >
          <VStack
            spacing={8}
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
            maxW={{ base: 'full', md: '600px' }}
            mr={{ md: '20' }}
            mb={{ base: '16', md: '0' }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="1.2"
            >
              Project Management & Documentation Made Simple
            </Heading>
            
            <Text fontSize={{ base: 'lg', md: 'xl' }} opacity="0.9">
              Generate comprehensive documentation, visualize business processes, and efficiently manage your projects all in one platform.
            </Text>
            
            <Stack 
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              w={{ base: 'full', sm: 'auto' }}
            >
              <Link href="/create-project" passHref>
                <Button
                  as="a"
                  size="lg"
                  bg="white"
                  color="blue.600"
                  _hover={{ bg: 'gray.100' }}
                  px={8}
                >
                  Create Project
                </Button>
              </Link>
              
              <Link href="/bpmn-viewer" passHref>
                <Button
                  as="a"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  rightIcon={<FiArrowRight />}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  px={8}
                >
                  View Demo
                </Button>
              </Link>
            </Stack>
          </VStack>
          
          <Box
            flex="1"
            display={{ base: 'none', md: 'block' }}
            position="relative"
            maxW={{ md: '600px' }}
          >
            <Box
              bg="blue.500"
              borderRadius="xl"
              boxShadow="xl"
              h="400px"
              w="600px"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="10%"
                left="10%"
                right="10%"
                bottom="10%"
                bg="whiteAlpha.100"
                borderRadius="lg"
              />
              <Box
                position="absolute"
                top="15%"
                left="15%"
                width="70%"
                height="20px"
                bg="whiteAlpha.300"
                borderRadius="md"
              />
              <Box
                position="absolute"
                top="25%"
                left="15%"
                width="40%"
                height="20px"
                bg="whiteAlpha.200"
                borderRadius="md"
              />
              <Box
                position="absolute"
                top="40%"
                left="15%"
                right="15%"
                bottom="25%"
                bg="whiteAlpha.100"
                borderRadius="md"
                display="flex"
                flexWrap="wrap"
                gap="10px"
                padding="10px"
              >
                {[...Array(6)].map((_, i) => (
                  <Box 
                    key={i}
                    width="calc(33% - 10px)" 
                    height="40px" 
                    bg="whiteAlpha.200" 
                    borderRadius="md"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
} 