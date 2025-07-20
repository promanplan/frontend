import { NextSeoProps } from 'next-seo'
import { FaGithub } from 'react-icons/fa'
import { FiCheck, FiFileText, FiLayers, FiActivity } from 'react-icons/fi'

// Simple logo component
export const Logo = () => (
  <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>PMP</span>
)

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'PMP - Project Management Platform',
    description: 'Generate and manage your project documentation efficiently',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        label: 'Features',
      },
      {
        label: 'BPMN Viewer',
        href: '/bpmn-viewer',
      },
      {
        label: 'Document',
        href: '/document',
      },
      {
        label: 'Create Project',
        href: '/create-project',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        © {new Date().getFullYear()} PMP - Project Management Platform
      </>
    ),
    links: [
      {
        href: 'mailto:contact@pmp.com',
        label: 'Contact',
      },
      {
        href: 'https://github.com/yourorg/pmp',
        label: <FaGithub size="14" />,
      },
    ],
  },
  features: [
    {
      title: 'Project Documentation',
      description: 'Generate comprehensive documentation for your projects',
      icon: FiFileText,
    },
    {
      title: 'BPMN Modeling',
      description: 'Create, edit and visualize business process models',
      icon: FiLayers,
    },
    {
      title: 'Process Management',
      description: 'Efficiently manage and track your business processes',
      icon: FiActivity,
    },
  ],
}

export default siteConfig 