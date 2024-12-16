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
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: true,
        link: 'https://cal.com'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>I'm a passionate developer with over 5 years of experience in bringing success to teams by building great relationships and understanding the needs of clients to build high-performing custom digital solutions. I have a proven history of engineering bespoke web application features and crafting user-friendly designs and components. I'm an avid mentor and open-source contributor, passionate about sharing knowledge and giving back to the development community. My work spans digital interfaces, interactive experiences, and the convergence of design and technology.</>
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
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Blu Omega Consulting',
                timeframe: '2024',
                role: 'Full Stack Developer',
                achievements: [
                    <>Contributed to a federal project team that rebuilt the National Heart, Lung, and Blood Institute website using Agile methodologies and a DevOps toolset on Microsoft Azure, resulting in a 30% increase in user engagement and a 25% increase in website accessibility compliance.</>,
                    <>Cleaned up legacy code resulting in a 25% reduction in total repository size, modernizing the codebase and reducing technical debt.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Spruce Technologies',
                timeframe: '2023',
                role: 'Full Stack Developer',
                achievements: [
                    <>Improved the Delaware River and Bay Authority website performance by 40% through optimizing the underlying infrastructure and implementing content delivery network (CDN) caching.</>,
                    <>Designed and implemented a search feature for CalTrans RebuildingCA project, allowing users to find key information on California's budget spending.</>,
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
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
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Business Enterprise Institute',
                timeframe: '2021 - 2022',
                role: 'Full Stack Developer',
                achievements: [
                    <>Designed and developed a comprehensive course using Learning Management Systems (LMS) to educate and certify BEI's nationwide network of over 2000 financial planning consultants.</>,
                    <>Led the reconstruction of the company homepage from scratch, ensuring a seamless user experience through collaboration with cross-functional teams, resulting in a 30% increase in organic traffic through targeted SEO optimization.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Tiny Feet Toolkit',
                timeframe: '2020 - 2021',
                role: 'Lead Engineer',
                achievements: [
                    <>Led the creation of a Google Maps API-based feature that allowed users to visualize greenhouse gas emissions data by location.</>,
                    <>Spearheaded the development of a tailored recommendation tool powered by a custom REST API.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            }
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Studies',
        institutions: [
            {
                name: 'Western Colorado University',
                description: <>Studied Computer Science.</>,
                logo: '/logos/western.png'
            },
            {
                name: 'State University of New York at Purchase',
                description: <>Studied Media and Communications.</>,
                logo: '/logos/purchaseCollege.png'
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            {
                title: 'Figma',
                description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
                images: [
                    {
                        src: '/images/projects/project-01/cover-02.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-03.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Next.js',
                description: <>Building next gen apps with Next.js.</>,
                images: [
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    }
}

const blog = {
    label: 'Blog',
    title: 'Writing about design and tech...',
    description: `Read what ${person.name} has been up to recently`
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Work',
    title: 'My projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'My photo gallery',
    description: `A photo collection by ${person.name}`,
    // Images from https://pexels.com
    images: [
        { 
            src: '/images/gallery/img-01.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-02.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-03.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-04.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-05.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-06.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-07.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-08.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-09.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-10.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-11.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-12.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-13.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-14.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
    ]
}

export { person, social, newsletter, home, about, blog, work, gallery };