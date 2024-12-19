import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Eric',
    lastName:  'Swanson',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Full Stack Developer',
    avatar:    '/images/avatar.jpg',
    location:  'America/Denver',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: []  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/erics1337',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/in/ericsdesign',
    },
    {
        name: 'X',
        icon: 'x',
        link: 'https://x.com/eric__electric',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:erics1337@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: <>Welcome to {person.firstName}'s Portfolio</>,
    subline: <>I'm a creative problem solver who thrives on the intersection of design and engineering.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: true
    },
    avatar: {
        display: true
    },
    calendar: {
        display: true,
        link: 'https://cal.com/eric-swanson'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>I'm a passionate {person.role} with a focus on building innovative solutions. I combine technical expertise with creative problem-solving to deliver impactful software solutions.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'Nularian',
                timeframe: '2025',
                role: 'Full Stack Engineer',
                achievements: [
                    <>Designed and developed a scalable, user-centric interface for Nularian Electrify's AI-automated workflow.</>,
                    <>Integrated LLM-powered solutions with Nularian Electrify's workflow, resulting in an average of 50% decrease in time-to-value for AI-automated tasks.</>
                ],
                images: [], // actual project images come from MDX files
            },
            {
                company: 'Blu Omega Consulting',
                timeframe: '2024',
                role: 'Full Stack Developer',
                achievements: [
                    <>Contributed to a federal project team that rebuilt the National Heart, Lung, and Blood Institute website using Agile methodologies and a DevOps toolset on Microsoft Azure, resulting in a 30% increase in user engagement and a 25% increase in website accessibility compliance.</>,
                    <>Cleaned up legacy code resulting in a 25% reduction in total repository size, modernizing the codebase and reducing technical debt.</>
                ],
                images: [], // actual project images come from MDX files
            },
            {
                company: 'Spruce Technologies',
                timeframe: '2023',
                role: 'Full Stack Developer',
                achievements: [
                    <>Improved the Delaware River and Bay Authority website performance by 40% through optimizing the underlying infrastructure and implementing content delivery network (CDN) caching.</>,
                    <>Designed and implemented a search feature for CalTrans RebuildingCA project, allowing users to find key information on California's budget spending.</>,
                ],
                images: [], // actual project images come from MDX files
            },
            {
                company: 'Kitzuma Cycling Logistics',
                timeframe: '2022',
                role: 'Full Stack Engineer',
                achievements: [
                    <>Contributed to the development of company tools used to manage shipping logistics including tracking, invoicing, and order fulfillment, resulting in a 25% reduction in time spent on order fulfillment.</>,
                    <>Operationalized scripts for various internal processes by creating UI interfaces for the proprietary Transportation Management System (TMS) software using Salesforce platform.</>,
                    <>Redesigned company marketing website from the legacy codebase and integrated it with a headless CMS, resulting in a 50% increase in website engagement and a 30% increase in lead generation.</>,
                ],
                images: [], // actual project images come from MDX files
            },
            {
                company: 'Business Enterprise Institute',
                timeframe: '2021 - 2022',
                role: 'Full Stack Developer',
                achievements: [
                    <>Designed and developed a comprehensive course using Learning Management Systems (LMS) to educate and certify BEI's nationwide network of over 2000 financial planning consultants.</>,
                    <>Led the reconstruction of the company homepage from scratch, ensuring a seamless user experience through collaboration with cross-functional teams, resulting in a 30% increase in organic traffic through targeted SEO optimization.</>
                ],
                images: [], // actual project images come from MDX files
            },
            {
                company: 'Tiny Feet Toolkit',
                timeframe: '2020 - 2021',
                role: 'Lead Engineer',
                achievements: [
                    <>Led the creation of a Google Maps API-based feature that allowed users to visualize greenhouse gas emissions data by location.</>,
                    <>Spearheaded the development of a tailored recommendation tool powered by a custom REST API.</>
                ],
                images: [], // actual project images come from MDX files
            }
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Studies',
        institutions: [
            {
                name: 'Western Colorado University',
                description: <>Bachelor of Science, Computer Science</>,
                logo: '/logos/western.png'
            },
            {
                name: 'State University of New York at Purchase',
                description: <>Bachelor of Arts, Media and Communications</>,
                logo: '/logos/purchaseCollege.png'
            }
        ]
    },
    technical: {
        display: false // Hiding technical skills section
    },
    certifications: {
        display: true,
        title: 'Certifications',
        certs: [
            {
                name: 'AWS Certified Cloud Practitioner',
                issuer: 'Amazon Web Services (AWS)',
                issueDate: 'December 2023',
                expirationDate: 'December 2026',
                credentialId: '6df0cb31-d027-4dc0-979e-bbf95c425646',
                credentialURL: 'https://www.credly.com/badges/6df0cb31-d027-4dc0-979e-bbf95c425646/linked_in_profile',
                description: 'Validates overall understanding of the AWS Cloud, including key services, use cases, billing and pricing models, security concepts, and basic architectural principles.',
                image: '/images/certifications/aws-cloud-practitioner.png'
            }
        ]
    },
}

const blog = {
    label: 'Blog',
    title: 'Writing about design and tech...',
    description: 'Thoughts, stories, and ideas about design, technology, and creativity.'
}

const gallery = {
    label: 'Gallery',
    title: 'Project Gallery',
    description: 'A visual showcase of my work and projects'
};

const work = {
    label: 'Work',
    title: 'My projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

export { person, newsletter, social, home, about, blog, work, gallery };