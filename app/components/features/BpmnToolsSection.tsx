import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Flex,
} from '@chakra-ui/react'
import Link from 'next/link'
import { 
  FiEye, FiUpload, FiLink, FiEdit, FiColumns 
} from 'react-icons/fi'

interface BpmnToolCardProps {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

const BpmnToolCard = ({ title, description, icon, href }: BpmnToolCardProps) => {
  return (
    <Link href={href} passHref>
      <Card 
        as="a"
        height="100%"
        cursor="pointer"
        borderRadius="lg"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-5px)',
          shadow: 'lg',
          borderColor: 'blue.500',
        }}
      >
        <CardHeader pb={0}>
          <Flex direction="row" align="center" mb={2}>
            <Icon as={icon} boxSize={5} color="blue.500" mr={2} />
            <Heading size="md" fontWeight="semibold">
              {title}
            </Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Text color="gray.600">{description}</Text>
        </CardBody>
      </Card>
    </Link>
  )
}

export const BpmnToolsSection = () => {
  const bpmnTools = [
    {
      title: 'Simple Viewer',
      description: 'View a basic BPMN diagram with interactive navigation',
      icon: FiEye,
      href: '/bpmn-viewer',
    },
    {
      title: 'Upload BPMN',
      description: 'Upload and view your own BPMN files with ease',
      icon: FiUpload,
      href: '/bpmn-viewer/upload',
    },
    {
      title: 'URL Viewer',
      description: 'View BPMN files directly from a URL source',
      icon: FiLink,
      href: '/bpmn-viewer/url',
    },
    {
      title: 'BPMN Modeler',
      description: 'Create and edit BPMN diagrams with our intuitive modeler',
      icon: FiEdit,
      href: '/bpmn-viewer/modeler',
    },
    {
      title: 'BPMN Workspace',
      description: 'Edit and preview diagrams side-by-side in a workspace',
      icon: FiColumns,
      href: '/bpmn-viewer/workspace',
    },
  ]

  return (
    <Box as="section" py={20} bg="gray.50">
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
              BPMN Viewer Tools
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Our comprehensive suite of BPMN tools to help you visualize and manage business processes
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} width="full">
            {bpmnTools.map((tool, idx) => (
              <BpmnToolCard
                key={idx}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
} 