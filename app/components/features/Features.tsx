import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FiActivity, FiFileText, FiLayers } from 'react-icons/fi'
import { IconType } from 'react-icons'
import siteConfig from '@/data/config'

interface FeatureProps {
  title: string
  description: string
  icon: IconType
}

const Feature = ({ title, description, icon }: FeatureProps) => {
  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      shadow="md"
      transition="all 0.3s"
      _hover={{ shadow: 'lg', transform: 'translateY(-5px)' }}
    >
      <Flex
        w={12}
        h={12}
        bg="blue.50"
        color="blue.500"
        borderRadius="full"
        align="center"
        justify="center"
        mb={4}
      >
        <Icon as={icon} boxSize={6} />
      </Flex>
      <Heading as="h3" size="md" mb={3} fontWeight="semibold">
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  )
}

export const Features = () => {
  return (
    <Box as="section" py={20} bg="gray.50" id="features">
      <Container maxW="container.xl">
        <Stack spacing={12} align="center">
          <Stack spacing={4} textAlign="center" maxW="xl">
            <Heading
              as="h2"
              size="xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              Powerful features for efficient project management
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Our platform provides all the tools you need to create, manage and document your projects effectively.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
            {siteConfig.features.map((feature, idx) => (
              <Feature
                key={idx}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
} 