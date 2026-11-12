
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const M = require('../models');

// ======================================================
// CONFIGURATION
// ======================================================

const FS = 'Full Stack';
const AI = 'AI';
const WA = 'Web Applications';
const TOOLS = 'Developer Tools';

const GITHUB = 'https://github.com/pranavap2026-ship-it';

const p = (
  title,
  short,
  tech,
  categories,
  extra = {}
) => ({
  title,
  short,
  tech,
  categories,
  overview: '',
  problem: '',
  solution: '',
  features: [],
  architecture: '',
  challenges: '',
  contribution: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  published: false,
  ...extra,
});

// ======================================================
// PROJECTS
// ======================================================

const projects = [

  // 01 - CAMPUS TWIN
  p(
    'Campus Twin',
    'A Campus Digital Twin platform designed to digitize college operations through interactive campus mapping, role-based dashboards and integrated campus services.',
    [
      'React',
      'Vite',
      'JavaScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'JWT',
      'Axios'
    ],
    [FS, WA],
    {
      featured: true,

      overview:
        'Campus Twin is a digital campus management platform designed to bring different college services into one centralized application. It provides role-specific dashboards and digital tools for students, faculty and administrators.',

      problem:
        'Traditional campus operations often depend on disconnected systems and manual processes. Students and staff may need to access different platforms for timetables, notices, complaints and campus information.',

      solution:
        'Campus Twin provides a centralized digital platform with role-based access and integrated campus modules.',

      features: [
        'Role-based authentication',
        'Student dashboard',
        'Faculty dashboard',
        'Admin dashboard',
        'Interactive campus map',
        'Timetable management',
        'Notice management',
        'Event management',
        'Complaint management',
        'Digital campus directory',
        'Canteen module',
        'Lost and found module',
        'Emergency information',
        'AI assistant module',
        'Role-specific dashboards'
      ],

      architecture:
        'React and Vite frontend connected to an Express.js REST API backend. MongoDB and Mongoose manage application data. JWT authentication supports protected routes and role-based authorization.',

      challenges:
        'Designing a unified application for multiple user roles, organizing modules and maintaining access permissions across different campus services.',

      contribution:
        'Designed and developed the application structure, frontend modules, backend integration, authentication flow and campus service interfaces.'
    }
  ),

  // 02 - MAZHAUNDO
  p(
    'Mazhaundo',
    'A real-time rain reporting platform with geospatial visualization, location-based reports and offline-first Progressive Web App capabilities.',
    [
      'Next.js',
      'React',
      'Express.js',
      'Node.js',
      'Redis',
      'BullMQ',
      'Socket.IO',
      'Leaflet',
      'PWA'
    ],
    [FS, WA],
    {
      featured: true,

      overview:
        'Mazhaundo is a rain reporting platform designed to help users report rainfall conditions and visualize location-based information through an interactive map.',

      problem:
        'Rainfall information can vary significantly across nearby locations. Collecting and sharing localized reports can help provide a more useful picture of current conditions.',

      solution:
        'The platform combines location-based reporting, interactive geospatial visualization, real-time communication and offline reporting support.',

      features: [
        'Rain reporting',
        'Interactive map visualization',
        'Location-based reporting',
        'Real-time communication',
        'Offline report queue',
        'Progressive Web App support',
        'Background job processing'
      ],

      architecture:
        'A Turborepo-based architecture with a Next.js frontend and Express API. Redis and BullMQ support background job processing, Socket.IO supports real-time communication, and Leaflet provides map visualization.',

      challenges:
        'Integrating geospatial visualization, real-time communication and offline-first functionality into a unified application.',

      contribution:
        'Worked on the full-stack application, geospatial features, real-time communication and offline reporting workflow.'
    }
  ),

  // 03 - LABSHARE
  p(
    'LabShare',
    'A web-based code-sharing platform designed for students in a college computer laboratory.',
    [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'MongoDB'
    ],
    [FS, WA],
    {
      featured: true,

      liveUrl: 'https://labshare-nine.vercel.app/',

      // Repository is private.
      githubUrl: '',

      overview:
        'LabShare is a platform designed to make sharing code between computers in a college laboratory easier through a centralized web interface.',

      problem:
        'Students in a computer laboratory may need a simple way to transfer or share code between devices without relying on manual file transfers.',

      solution:
        'LabShare provides a browser-accessible platform for sharing code across supported devices.',

      features: [
        'Code sharing',
        'Responsive interface',
        'Online device management',
        'Computer and mobile support',
        'Web-based access'
      ],

      architecture:
        'Next.js frontend with a backend application and data persistence layer.',

      challenges:
        'Designing a responsive code-sharing experience that works across multiple devices and handling online device information.',

      contribution:
        'Developed the web application, user interface and code-sharing workflows.'
    }
  ),

  // 04 - REVYNIX AI
  p(
    'Revynix AI',
    'An AI-powered code review application designed to assist developers in analyzing source code.',
    [
      'JavaScript',
      'React',
      'Node.js',
      'AI APIs'
    ],
    [AI, WA],
    {
      featured: true,

      githubUrl: `${GITHUB}/Revynix-AI`,

      overview:
        'Revynix AI is an AI-powered code reviewer project designed to help developers analyze code and obtain AI-assisted feedback.',

      problem:
        'Manually reviewing code can be time-consuming, especially when developers need help identifying potential issues and understanding code quality.',

      solution:
        'The application uses AI-assisted analysis to provide developers with feedback on submitted source code.',

      features: [
        'AI-assisted code review',
        'Source code analysis',
        'Developer-focused interface',
        'AI-generated feedback'
      ],

      architecture:
        'JavaScript-based web application integrated with an AI-powered backend service.',

      challenges:
        'Connecting AI functionality with a developer-friendly interface and presenting code analysis results clearly.',

      contribution:
        'Worked on the AI code reviewer application and its web-based development workflow.'
    }
  ),

  // 05 - DRAKSHA AYURVEDA
  p(
    'Draksha Ayurveda',
    'A professional website developed for an Ayurvedic clinic, presenting its services and information through a modern responsive interface.',
    [
      'Next.js',
      'React',
      'Node.js',
      'MongoDB',
      'Cloudinary'
    ],
    [FS, WA],
    {
      featured: true,

      liveUrl: 'https://drakshaayurveda.in',

      // Repository is private.
      githubUrl: '',

      overview:
        'Draksha Ayurveda is a website developed for an Ayurvedic clinic to establish its online presence and present clinic information and services.',

      problem:
        'The clinic needed a professional online presence where visitors could explore its information and services.',

      solution:
        'Developed a responsive website with a modern interface and organized content presentation.',

      features: [
        'Responsive website',
        'Clinic information',
        'Treatment and service presentation',
        'Image management',
        'Modern user interface',
        'Mobile-friendly layout'
      ],

      architecture:
        'Next.js-based frontend with backend services and MongoDB data management. Cloudinary supports image storage and delivery.',

      challenges:
        'Building a professional healthcare-related website with clear content presentation and responsive layouts.',

      contribution:
        'Developed the website, implemented its interface and integrated the required backend and image-management functionality.'
    }
  ),

  // 06 - AYUHEAVEN
  p(
    'AyuHeaven',
    'An informational website for an Ayurvedic clinic featuring treatment information and a modern responsive interface.',
    [
      'Next.js',
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Cloudinary'
    ],
    [FS, WA],
    {
      // Repository is private.
      githubUrl: '',

      liveUrl: 'https://ayuheaven.vercel.app/',

      overview:
        'AyuHeaven is an informational website created to present Ayurvedic clinic information and treatment-related content.',

      problem:
        'Visitors need an accessible online platform to explore clinic information and available treatments.',

      solution:
        'Developed a responsive informational website with organized treatment content and a modern interface.',

      features: [
        'Clinic information',
        'Treatment and program pages',
        'Responsive design',
        'Image management',
        'Content presentation'
      ],

      architecture:
        'Next.js frontend connected to a Node.js and Express backend with MongoDB and Cloudinary integration.',

      challenges:
        'Frontend migration, API integration, image handling and deployment configuration.',

      contribution:
        'Worked on frontend development, backend integration, content pages and deployment.'
    }
  ),

  // 07 - APPLYMIND AI
  p(
    'ApplyMind AI',
    'An AI Resume Builder, ATS and recruitment platform designed to support job seekers and recruitment workflows.',
    [
      'TypeScript',
      'React',
      'AI Integration',
      'Web Technologies'
    ],
    [AI, WA],
    {
      // Repository is private.
      githubUrl: '',

      overview:
        'ApplyMind AI is a project focused on AI-assisted resume building, applicant tracking and recruitment-related workflows.',

      problem:
        'Job seekers need better ways to prepare resumes, while recruitment workflows require organized candidate information.',

      solution:
        'A platform concept combining AI-assisted resume tools with recruitment and applicant-tracking functionality.',

      features: [
        'AI resume builder concept',
        'ATS-related functionality',
        'Recruitment platform',
        'Candidate workflow management'
      ],

      architecture:
        'TypeScript-based web application architecture.',

      challenges:
        'Designing a unified workflow for resume creation and recruitment-related functionality.',

      contribution:
        'Worked on the web application and its recruitment-focused project structure.'
    }
  ),

  // 08 - WROTH
  p(
    'WROTH',
    'A production-oriented men’s fashion and lifestyle e-commerce platform designed for the Indian market.',
    [
      'JavaScript',
      'React',
      'Node.js',
      'E-commerce'
    ],
    [FS, WA],
    {
      // Repository is private.
      githubUrl: '',

      overview:
        'WROTH is a men’s fashion and lifestyle e-commerce project focused on presenting products and supporting online shopping workflows.',

      problem:
        'Fashion businesses need an accessible digital storefront to showcase products and support online shopping.',

      solution:
        'A dedicated e-commerce platform with a storefront-oriented interface.',

      features: [
        'Fashion storefront',
        'Product presentation',
        'E-commerce interface',
        'Responsive shopping experience'
      ],

      architecture:
        'Frontend storefront and backend application architecture.',

      challenges:
        'Designing an attractive storefront and organizing the shopping experience.',

      contribution:
        'Worked on the e-commerce application and frontend development.'
    }
  ),

  // 09 - OPTIMA / MY ON SHOP
  p(
    'Optima - My On Shop',
    'An online shopping project with a dedicated frontend and backend repository.',
    [
      'JavaScript',
      'React',
      'Node.js',
      'E-commerce'
    ],
    [FS, WA],
    {
      // Frontend repository is public.
      githubUrl: `${GITHUB}/optima-frontend`,

      overview:
        'Optima, also referred to as My On Shop, is an online shopping project with separate frontend and backend development repositories.',

      problem:
        'An online store requires an organized interface for presenting products and supporting shopping-related workflows.',

      solution:
        'A web application organized around a dedicated shopping interface and backend service.',

      features: [
        'Shopping interface',
        'Product presentation',
        'Frontend and backend separation'
      ],

      architecture:
        'Separate frontend and backend repositories. The frontend repository is publicly accessible.',

      challenges:
        'Integrating the frontend and backend application components.',

      contribution:
        'Worked on the frontend application and project development.'
    }
  ),

  // 10 - SKY WING MEDIA
  p(
    'SkyWing Media',
    'A college media team platform associated with photography, video editing, content creation and digital media activities.',
    [
      'JavaScript',
      'React',
      'Web Development'
    ],
    [WA],
    {
      githubUrl: `${GITHUB}/skywing`,

      overview:
        'SkyWing Media is associated with the college media team and its digital media activities.',

      problem:
        'A media team needs an organized digital presence to communicate its activities and showcase its work.',

      solution:
        'A web-based project associated with the media team.',

      features: [
        'Media team information',
        'Digital content presentation',
        'Team-related information',
        'Media project showcase'
      ],

      architecture:
        'JavaScript-based web application.',

      contribution:
        'Worked on media-related digital content and website development.'
    }
  ),

  // 11 - JOBVENO
  p(
    'Jobveno',
    'A job-related web application designed to support job discovery and career-related workflows.',
    [
      'JavaScript',
      'Web Development'
    ],
    [WA],
    {
      overview:
        'Jobveno is a job-related application concept focused on career and employment workflows.',

      problem:
        'Job seekers need accessible platforms to explore career opportunities.',

      solution:
        'A web application concept focused on job-related information and workflows.',

      features: [
        'Job-related interface',
        'Career-focused workflows',
        'Web-based access'
      ],

      contribution:
        'Worked on the application concept and web development.'
    }
  ),

  // 12 - TALENTMATCH AI
  p(
    'TalentMatch AI',
    'An AI-powered talent matching platform concept designed to connect suitable candidates with opportunities.',
    [
      'JavaScript',
      'AI Integration'
    ],
    [AI, WA],
    {
      overview:
        'TalentMatch AI is a project concept focused on AI-assisted talent matching.',

      problem:
        'Matching candidate profiles with suitable opportunities can require time-consuming manual evaluation.',

      solution:
        'An AI-oriented platform concept for supporting candidate and opportunity matching.',

      features: [
        'Talent matching concept',
        'AI-assisted workflows',
        'Candidate-focused functionality'
      ],

      contribution:
        'Worked on the application concept and development.'
    }
  ),

  // 13 - TASKFLOW AI
  p(
    'TaskFlow AI',
    'An AI-powered task management application concept focused on productivity and workflow organization.',
    [
      'JavaScript',
      'AI Integration'
    ],
    [AI, WA],
    {
      overview:
        'TaskFlow AI is a productivity-focused project concept combining task management with AI-assisted functionality.',

      problem:
        'Managing tasks and organizing daily workflows can become difficult when information is scattered.',

      solution:
        'A centralized task management application concept with AI-assisted features.',

      features: [
        'Task management concept',
        'Workflow organization',
        'AI-assisted productivity'
      ],

      contribution:
        'Worked on the project concept and web application development.'
    }
  ),

  // 14 - WORLD CUP X 2026
  p(
    'WorldCupX 2026',
    'A football tournament-related web application concept for presenting tournament information and related content.',
    [
      'JavaScript',
      'React',
      'Web Development'
    ],
    [WA],
    {
      overview:
        'WorldCupX 2026 is a football tournament-related web application project.',

      problem:
        'Sports fans need accessible interfaces to explore tournament-related information.',

      solution:
        'A web application concept focused on football tournament information.',

      features: [
        'Tournament-related content',
        'Football information presentation',
        'Responsive web interface'
      ],

      contribution:
        'Worked on the web application concept and development.'
    }
  ),

  // 15 - SMART CANTEEN AI
  p(
    'Smart Canteen AI',
    'A smart college canteen management project concept incorporating AI-based features.',
    [
      'JavaScript',
      'AI Integration',
      'Web Development'
    ],
    [AI, WA],
    {
      overview:
        'Smart Canteen AI is a college canteen management project concept exploring AI-assisted functionality.',

      problem:
        'College canteen operations can involve manual processes and inefficient information management.',

      solution:
        'A smart canteen application concept designed to support digital canteen workflows.',

      features: [
        'Canteen management concept',
        'Digital workflow support',
        'AI-based feature exploration'
      ],

      contribution:
        'Worked on the project concept and application development.'
    }
  ),

  // 16 - COLLEGE COMPLAINT BOX
  p(
    'College Complaint Box',
    'A MERN stack-based college complaint management system for submitting, tracking and managing student complaints.',
    [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'JWT'
    ],
    [FS, WA],
    {
      overview:
        'A college complaint management application designed to digitize complaint submission and administrative handling.',

      problem:
        'Manual complaint processes can make tracking, managing and resolving student concerns difficult.',

      solution:
        'A web-based complaint management system that provides students and administrators with a centralized platform.',

      features: [
        'Student complaint submission',
        'Complaint tracking',
        'Administrative management',
        'Complaint categorization',
        'Authentication',
        'Role-based access'
      ],

      architecture:
        'MERN stack architecture with React frontend, Express and Node.js backend, MongoDB database and JWT authentication.',

      contribution:
        'Designed and developed the full-stack complaint management application.'
    }
  ),

  // 17 - HOME SERVICE MARKETPLACE
  p(
    'Home Service Marketplace',
    'A web application concept connecting customers with home service providers through a digital marketplace.',
    [
      'JavaScript',
      'React',
      'Node.js',
      'MongoDB'
    ],
    [FS, WA],
    {
      overview:
        'A marketplace concept designed to connect customers looking for home services with service providers.',

      problem:
        'Finding and connecting with suitable home service providers can be difficult without a centralized platform.',

      solution:
        'A digital marketplace concept that brings customers and service providers together.',

      features: [
        'Customer-oriented interface',
        'Service provider concept',
        'Service discovery',
        'Marketplace workflow'
      ],

      contribution:
        'Worked on the project concept and application development.'
    }
  ),

  // 18 - TAILORING SHOP
  p(
    'Tailoring Shop',
    'A website project for a tailoring business to present services and provide customers with an online information platform.',
    [
      'JavaScript',
      'React',
      'Web Development'
    ],
    [WA],
    {
      overview:
        'A business website project designed for a tailoring shop.',

      problem:
        'Local businesses need a digital presence to showcase their services and provide information to customers.',

      solution:
        'A web-based business presentation platform.',

      features: [
        'Business information',
        'Service presentation',
        'Responsive layout',
        'Customer information access'
      ],

      contribution:
        'Worked on the website design and development.'
    }
  ),

  // 19 - WEATHER APP
  p(
    'Syntecxhub Weather App',
    'A weather application developed as part of frontend development practice.',
    [
      'JavaScript',
      'HTML5',
      'CSS3',
      'Weather API'
    ],
    [WA, TOOLS],
    {
      githubUrl: `${GITHUB}/Syntecxhub_Weather_app`,

      overview:
        'A weather application developed during the Syntecxhub frontend development internship.',

      problem:
        'Users need a simple interface to explore weather information.',

      solution:
        'A web-based weather application.',

      features: [
        'Weather information interface',
        'API integration',
        'Responsive design'
      ],

      contribution:
        'Developed the frontend weather application.'
    }
  ),

  // 20 - QUIZ APP
  p(
    'Syntecxhub Quiz App',
    'A browser-based quiz application developed as part of frontend development practice.',
    [
      'JavaScript',
      'HTML5',
      'CSS3'
    ],
    [WA, TOOLS],
    {
      githubUrl: `${GITHUB}/Syntecxhub_Quiz_App`,

      overview:
        'A quiz application developed during frontend development practice.',

      problem:
        'Users need a simple interactive interface for answering quiz questions.',

      solution:
        'A browser-based quiz application.',

      features: [
        'Quiz interface',
        'Interactive questions',
        'User-friendly layout'
      ],

      contribution:
        'Developed the frontend quiz application.'
    }
  ),

  // 21 - TODO APP
  p(
    'Syntecxhub Todo App',
    'A simple task management application developed as part of frontend development practice.',
    [
      'JavaScript',
      'HTML5',
      'CSS3'
    ],
    [WA, TOOLS],
    {
      githubUrl: `${GITHUB}/Syntecxhub_todo_app`,

      overview:
        'A todo application developed to practice frontend development and task management interfaces.',

      problem:
        'Users need a straightforward way to organize everyday tasks.',

      solution:
        'A simple browser-based task management interface.',

      features: [
        'Task creation',
        'Task listing',
        'Task management interface'
      ],

      contribution:
        'Developed the frontend todo application.'
    }
  ),

  // 22 - LANDING PAGE
  p(
    'Syntecxhub Landing Page',
    'A responsive landing page developed as part of frontend development practice.',
    [
      'HTML5',
      'CSS3',
      'JavaScript'
    ],
    [WA, TOOLS],
    {
      githubUrl: `${GITHUB}/Syntecxhub_Landing_page`,

      overview:
        'A landing page project developed during frontend development practice.',

      problem:
        'A web project needs a clear and visually organized landing page to present its content.',

      solution:
        'A responsive landing page built using frontend technologies.',

      features: [
        'Responsive layout',
        'Structured content',
        'Frontend styling'
      ],

      contribution:
        'Developed the landing page interface.'
    }
  ),

  // 23 - SYNTECXHUB PORTFOLIO
  p(
    'Syntecxhub Portfolio',
    'A portfolio website project developed during the Syntecxhub frontend development internship.',
    [
      'HTML5',
      'CSS3',
      'JavaScript'
    ],
    [WA, TOOLS],
    {
      githubUrl: `${GITHUB}/Syntecxhub_pranav_protfolio`,

      overview:
        'A portfolio website developed as part of frontend development internship work.',

      problem:
        'Developers need a digital platform to showcase their work and skills.',

      solution:
        'A personal portfolio website presenting development-related information.',

      features: [
        'Portfolio presentation',
        'Project showcase',
        'Responsive interface'
      ],

      contribution:
        'Developed the portfolio website during internship work.'
    }
  )
];

// ======================================================
// PROFILE
// ======================================================

const profile = {
  fullName: 'Pranav',

  title: 'Full-Stack Developer | MERN Stack | Next.js',

  location: 'Kerala, India',

  available: true,

  email: 'appranav611@gmail.com',

  github: `${GITHUB}`,

  intro:
    "I'm a Computer Science and Engineering student passionate about building scalable web applications and solving real-world problems through technology.",

  bio:
    'Computer Science and Engineering student and web developer interested in building full-stack applications, modern user interfaces and AI-powered solutions.',

  summary:
    'I am a Computer Science and Engineering student with hands-on experience developing web applications using React, Next.js, Node.js, Express.js and MongoDB. My projects include campus management platforms, real-time reporting systems, AI-powered applications and business websites. I enjoy learning new technologies and building practical solutions to real-world problems.'
};

// ======================================================
// SKILLS
// ======================================================

const skills = {
  Frontend: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Tailwind CSS',
    'Responsive Web Design'
  ],

  Backend: [
    'Node.js',
    'Express.js',
    'REST APIs',
    'JWT Authentication',
    'Socket.IO',
    'API Integration'
  ],

  Database: [
    'MongoDB',
    'Mongoose',
    'MySQL',
    'PostgreSQL',
    'Redis'
  ],

  Programming: [
    'JavaScript',
    'Python',
    'C',
    'Java'
  ],

  Tools: [
    'Git',
    'GitHub',
    'VS Code',
    'Vercel',
    'Render',
    'Cloudinary',
    'Postman'
  ],

  'AI & APIs': [
    'LLM API Integration',
    'OpenRouter',
    'AI Integration'
  ]
};

// ======================================================
// MAIN SEED FUNCTION
// ======================================================

async function seed() {
  try {
    // 1. Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from backend/.env');
    }

    const adminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be configured in backend/.env'
      );
    }

    if (adminPassword.length < 14) {
      throw new Error(
        'ADMIN_PASSWORD must contain at least 14 characters'
      );
    }

    // 2. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully.');

    // 3. Create or update admin
    const hashedPassword = await bcrypt.hash(
      adminPassword,
      12
    );

    await M.Admin.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          email: adminEmail,
          password: hashedPassword
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    console.log('Admin account updated successfully.');

    // 4. Create or update profile
    const existingProfile = await M.Profile.findOne();

    if (existingProfile) {
      Object.assign(existingProfile, profile);
      await existingProfile.save();
    } else {
      await M.Profile.create(profile);
    }

    console.log('Profile seeded.');

    // 5. Website settings
    const websiteSettings = {
      siteTitle: 'Pranav | Full-Stack Developer',

      description:
        'Portfolio of Pranav, a full-stack developer and Computer Science student from Kerala, India.',

      footer: '© Pranav. All rights reserved.',

      siteUrl: ''
    };

    const existingSettings = await M.WebsiteSettings.findOne();

    if (existingSettings) {
      Object.assign(existingSettings, websiteSettings);
      await existingSettings.save();
    } else {
      await M.WebsiteSettings.create(websiteSettings);
    }

    console.log('Website settings seeded.');

    // 6. Skills
    for (const [category, names] of Object.entries(skills)) {
      for (const [order, name] of names.entries()) {
        await M.Skill.findOneAndUpdate(
          { name, category },
          {
            $set: {
              name,
              category,
              order,
              visible: true
            }
          },
          {
            upsert: true,
            new: true,
            runValidators: true
          }
        );
      }
    }

    console.log('Skills seeded.');

    // 7. Experience
    const experience = {
      company: 'Syntecxhub',

      role: 'Frontend Development Intern',

      type: 'Internship',

      mode: 'Remote',

      duration: '1 Month',

      startDate: '9 June 2026',

      description: [
        'Worked on frontend development tasks.',
        'Built web application interfaces.',
        'Practiced responsive web development.'
      ],

      tech: [
        'HTML',
        'CSS',
        'JavaScript'
      ],

      order: 0
    };

    await M.Experience.findOneAndUpdate(
      {
        company: experience.company,
        role: experience.role
      },
      {
        $set: experience
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log('Experience seeded.');

    // 8. Education
    const education = {
      institution: 'College of Engineering Poonjar',

      degree: 'B.Tech',

      department: 'Computer Science and Engineering',

      startYear: '2023',

      order: 0
    };

    await M.Education.findOneAndUpdate(
      {
        institution: education.institution
      },
      {
        $set: education
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log('Education seeded.');

    // 9. Projects
    console.log('\nProcessing projects...\n');

    for (const [index, project] of projects.entries()) {

      const existingProject = await M.Project.findOne({
        title: project.title
      });

      if (existingProject) {

        // Preserve existing publication status.
        const publishedStatus = existingProject.published;

        Object.assign(existingProject, project, {
          published: publishedStatus,
          order: index
        });

        await existingProject.save();

        console.log(`Updated: ${project.title}`);

      } else {

        await M.Project.create({
          ...project,
          published: false,
          order: index
        });

        console.log(`Created: ${project.title}`);
      }
    }

    // 10. Final summary
    const totalProjects = await M.Project.countDocuments();

    const publishedProjects = await M.Project.countDocuments({
      published: true
    });

    console.log('\n====================================');
    console.log('PORTFOLIO DATABASE SEED COMPLETED');
    console.log('====================================');

    console.log(`Projects in seed file: ${projects.length}`);
    console.log(`Projects in database: ${totalProjects}`);
    console.log(`Published projects: ${publishedProjects}`);

    console.log('Admin account: Updated');
    console.log('Profile: Updated');
    console.log('Skills: Updated');
    console.log('Education: Updated');
    console.log('Experience: Updated');

    console.log('====================================');

  } catch (error) {

    console.error('\nSEED ERROR:', error.message);

    process.exitCode = 1;

  } finally {

    await mongoose.disconnect();

    console.log('\nMongoDB disconnected.');
  }
}

seed();
