import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

export const ProjectSection = () => {
  const [projectId, setProjectId] = useState('test')

  return (
    <Box as="section" py={20} bg="white">
      <Container maxW="container.xl">
        <Stack spacing={12} align="center">
          <VStack spacing={4} textAlign="center" maxW="xl">
            <Heading
              as="h2"
              size="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              Access Your Projects
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Enter a project ID to view an existing project or create a new one
            </Text>
          </VStack>

          <Box
            w="full"
            maxW="xl"
            p={8}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="lg"
          >
            <VStack spacing={6}>
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Project ID
                </Text>
                <Input
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Enter project ID"
                  size="lg"
                />
              </Box>

              <Flex
                w="full"
                direction={{ base: 'column', sm: 'row' }}
                justify="center"
                gap={4}
              >
                <Link href={`/project/${projectId}`} passHref>
                  <Button
                    as="a"
                    colorScheme="blue"
                    size="lg"
                    w={{ base: 'full', sm: 'auto' }}
                    rightIcon={<FiArrowRight />}
                  >
                    Go to Project
                  </Button>
                </Link>
                
                <Link href="/create-project" passHref>
                  <Button
                    as="a"
                    variant="outline"
                    colorScheme="green"
                    size="lg"
                    w={{ base: 'full', sm: 'auto' }}
                  >
                    Create New Project
                  </Button>
                </Link>
              </Flex>
            </VStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
} 