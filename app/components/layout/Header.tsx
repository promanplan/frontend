import { Box, Container, Flex, HStack, Button, useDisclosure } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import siteConfig from '@/data/config'

export const Header = () => {
  const mobileNav = useDisclosure()
  const pathname = usePathname()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isScrolled = scrollY > 10

  return (
    <Box 
      as="header" 
      position="fixed" 
      top="0" 
      zIndex="999" 
      width="full"
      transition="all 0.2s"
      bg={isScrolled ? 'white' : 'transparent'}
      borderBottomWidth={isScrolled ? '1px' : '0'}
      borderBottomColor="gray.200"
      boxShadow={isScrolled ? 'sm' : 'none'}
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link href="/" passHref>
            <Box 
              cursor="pointer" 
              fontWeight="bold" 
              fontSize="2xl"
              color={isScrolled ? 'gray.800' : 'white'}
              transition="color 0.3s"
            >
              <siteConfig.logo />
            </Box>
          </Link>
          
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {siteConfig.header.links.map((link, i) => {
              // If link has an ID, it's an anchor link on the homepage
              const href = link.id ? `/#${link.id}` : link.href
              const isActive = link.href && pathname === link.href
              
              return (
                <Link key={i} href={href || '#'} passHref>
                  <Box
                    as="a"
                    px={3}
                    py={2}
                    fontWeight="medium"
                    position="relative"
                    transition="all 0.3s"
                    bg={link.variant === 'primary' ? 'blue.500' : 'transparent'}
                    rounded={link.variant === 'primary' ? 'md' : 'none'}
                    color={link.variant === 'primary' ? 'white' : (isScrolled ? 'gray.700' : 'white')}
                    _hover={{
                      bg: link.variant === 'primary' ? 'blue.600' : 'transparent',
                      color: link.variant === 'primary' ? 'white' : (isScrolled ? 'blue.500' : 'blue.300')
                    }}
                  >
                    {link.label}
                  </Box>
                </Link>
              )
            })}
          </HStack>
          
          {/* Mobile menu button - to be implemented */}
          <Box display={{ base: 'block', md: 'none' }}>
            <Button 
              aria-label="Open Menu" 
              variant="ghost"
              onClick={mobileNav.onOpen}
              color={isScrolled ? 'gray.800' : 'white'}
            >
              ☰
            </Button>
          </Box>
        </Flex>
      </Container>
      
      {/* Mobile menu - to be implemented */}
    </Box>
  )
} 