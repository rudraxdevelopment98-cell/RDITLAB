import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const pagesFile = path.join(dataDir, 'pages.json');
const teamFile = path.join(dataDir, 'team.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Types
export interface PageContent {
  id: string;
  title: string;
  section: string;
  content: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize default data if files don't exist
function initializeFiles() {
  if (!fs.existsSync(pagesFile)) {
    const defaultPages: PageContent[] = [
      {
        id: 'home-hero-title',
        title: 'RD IT Lab UK',
        section: 'hero',
        content: 'RD IT Lab UK',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'home-hero-desc',
        title: 'Hero Description',
        section: 'hero',
        content: 'Expert IT services for commercial and industrial clients, delivering laptop repair, PC builds, networking, lab setup, audits, and ongoing software support.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'about-mission',
        title: 'Our Mission',
        section: 'about',
        content: 'We want to make the IT environment secure and safe for the public with strong privacy practices and excellent availability.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'about-expertise',
        title: 'Our Expertise',
        section: 'about',
        content: 'With 4.5 years of experience (4 years in India, 1.5 years in UK), our team specializes in laptop and PC repairs, custom PC builds, data recovery, and networking solutions.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'about-approach',
        title: 'Our Approach',
        section: 'about',
        content: 'We pride ourselves on quick response times, high-quality service, and instant availability.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'about-values',
        title: 'Our Values',
        section: 'about',
        content: 'Trust, reliability, and customer satisfaction guide everything we do.',
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(pagesFile, JSON.stringify(defaultPages, null, 2));
  }

  if (!fs.existsSync(teamFile)) {
    const defaultTeam: TeamMember[] = [
      {
        id: 'member-1',
        name: 'Kuldeep J',
        role: 'Founder & Lead Technician',
        bio: 'Cyber Security Professional with Google Cybersecurity Certificate and MSC in Cybersecurity. 4.5 years of IT expertise across India and UK.',
        image: '/uploads/kuldeep.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(teamFile, JSON.stringify(defaultTeam, null, 2));
  }
}

// Initialize on module load
initializeFiles();

// Page Operations
export function getPages(): PageContent[] {
  try {
    const data = fs.readFileSync(pagesFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getPagesBySection(section: string): PageContent[] {
  return getPages().filter(p => p.section === section);
}

export function getPageById(id: string): PageContent | undefined {
  return getPages().find(p => p.id === id);
}

export function createPage(page: Omit<PageContent, 'id' | 'updatedAt'>): PageContent {
  const pages = getPages();
  const newPage: PageContent = {
    ...page,
    id: `page-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  pages.push(newPage);
  fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2));
  return newPage;
}

export function updatePage(id: string, updates: Partial<PageContent>): PageContent | undefined {
  const pages = getPages();
  const index = pages.findIndex(p => p.id === id);
  if (index === -1) return undefined;

  pages[index] = {
    ...pages[index],
    ...updates,
    id: pages[index].id,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2));
  return pages[index];
}

export function deletePage(id: string): boolean {
  const pages = getPages();
  const filtered = pages.filter(p => p.id !== id);
  if (filtered.length === pages.length) return false;
  fs.writeFileSync(pagesFile, JSON.stringify(filtered, null, 2));
  return true;
}

// Team Operations
export function getTeam(): TeamMember[] {
  try {
    const data = fs.readFileSync(teamFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return getTeam().find(m => m.id === id);
}

export function createTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): TeamMember {
  const team = getTeam();
  const newMember: TeamMember = {
    ...member,
    id: `member-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  team.push(newMember);
  fs.writeFileSync(teamFile, JSON.stringify(team, null, 2));
  return newMember;
}

export function updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | undefined {
  const team = getTeam();
  const index = team.findIndex(m => m.id === id);
  if (index === -1) return undefined;

  team[index] = {
    ...team[index],
    ...updates,
    id: team[index].id,
    createdAt: team[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(teamFile, JSON.stringify(team, null, 2));
  return team[index];
}

export function deleteTeamMember(id: string): boolean {
  const team = getTeam();
  const filtered = team.filter(m => m.id !== id);
  if (filtered.length === team.length) return false;
  fs.writeFileSync(teamFile, JSON.stringify(filtered, null, 2));
  return true;
}
