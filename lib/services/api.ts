/**
 * API service functions for projects and documents
 */
import { remark } from 'remark';
import html from 'remark-html';

export interface ProjectFile {
  url: string;
  filename: string;
  filetype: string;
}

export async function fetchProjectFiles(projectId: string): Promise<ProjectFile[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Error fetching project files: ${response.statusText}`);
    }
    // console.log('Response:', response.json());
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch project files:', error);
    return [];
  }
}

export async function fetchDocumentContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching document content: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    
    // Process markdown content with remark
    const processedContent = await remark()
      .use(html)
      .process(markdown);
    
    return processedContent.toString();
  } catch (error) {
    console.error('Failed to fetch document content:', error);
    return '';
  }
} 