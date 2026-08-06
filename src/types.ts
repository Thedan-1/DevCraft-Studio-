export type ActiveTab = 'readme' | 'snapshot' | 'palette' | 'workbench' | 'ai-assistant' | 'launch-kit';

export interface ReadmeSection {
  id: string;
  title: string;
  enabled: boolean;
  content: string;
}

export interface ReadmeConfig {
  projectTitle: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  author: string;
  githubUsername: string;
  repoName: string;
  license: string;
  demoUrl?: string;
  badges: string[];
  techStack: string[];
  sections: ReadmeSection[];
}

export interface CodeSnapshotSettings {
  code: string;
  language: string;
  theme: 'dracula' | 'one-dark' | 'monokai' | 'nord' | 'cyberpunk' | 'sunset' | 'emerald';
  background: 'gradient-purple' | 'gradient-ocean' | 'gradient-sunset' | 'gradient-emerald' | 'gradient-midnight' | 'dark-solid' | 'mesh';
  windowTitle: string;
  showLineNumbers: boolean;
  padding: number; // 16, 32, 64
  fontSize: number; // 12, 14, 16, 18
  shadow: boolean;
  macButtons: boolean;
  aspectRatio: 'auto' | '16:9' | '4:3' | '1:1';
}

export interface ColorSwatch {
  hex: string;
  name: string;
  rgb: string;
}

export interface AiTaskRequest {
  task: 'readme' | 'explain' | 'refactor' | 'commit';
  input: string;
  language?: string;
  context?: string;
}

export interface AiTaskResponse {
  result: string;
  error?: string;
}
