import Mermaid from '@/components/Mermaid';

export const config = {
  nodes: {},
  tags: {
    mermaid: {
      render: 'Mermaid',
      attributes: {},
      transform(node: any, config: any) {
        let chart = '';
        if (node.children && node.children.length > 0) {
          if (typeof node.children[0] === 'object' && node.children[0] !== null && 'content' in node.children[0]) {
            chart = node.children[0].content;
          } else {
            chart = node.children[0];
          }
        }
        return {
          ...node,
          attributes: {
            chart,
          },
          children: [],
        };
      },
    },
  },
  components: {
    Mermaid,
  },
}; 