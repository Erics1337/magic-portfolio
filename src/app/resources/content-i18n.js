import { InlineCode } from "@/once-ui/components";

const createI18nContent = (t) => {
    const person = {
        firstName: 'Eric',
        lastName:  'Swanson',
        get name() {
            return `${this.firstName} ${this.lastName}`;
        },
        role:      t("person.role"),
        avatar:    '/images/avatar.jpg',
        location:  'America/Denver',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
        languages: []  // optional: Leave the array empty if you don't want to display languages
    }

    const newsletter = {
        display: true,
        title: <>{t("newsletter.title", {firstName: person.firstName})}</>,
        description: <>{t("newsletter.description")}</>
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
        label: t("home.label"),
        title: t("home.title", {name: person.name}),
        description: t("home.description", {role: person.role}),
        headline: <>{t("home.headline", {firstName: person.firstName})}</>,
        subline: <>{t("home.subline")}</>
    }

    const about = {
        label: t("about.label"),
        title: t("about.title"),
        description: t("about.description", {name: person.name, role: person.role, location: person.location}),
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
            title: t("about.intro.title"),
            description: <>{t("about.intro.description", {role: person.role})}</>
        },
        work: {
            display: true, // set to false to hide this section
            title: t("about.work.title"),
            experiences: [
                {
                    company: 'Nularian',
                    timeframe: t("about.work.experiences.Nularian.timeframe"),
                    role: t("about.work.experiences.Nularian.role"),
                    achievements: t("about.work.experiences.Nularian.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                },
                {
                    company: 'Blu Omega Consulting',
                    timeframe: t("about.work.experiences.BluOmega.timeframe"),
                    role: t("about.work.experiences.BluOmega.role"),
                    achievements: t("about.work.experiences.BluOmega.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                },
                {
                    company: 'Spruce Technologies',
                    timeframe: t("about.work.experiences.Spruce.timeframe"),
                    role: t("about.work.experiences.Spruce.role"),
                    achievements: t("about.work.experiences.Spruce.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                },
                {
                    company: 'Kitzuma Cycling Logistics',
                    timeframe: t("about.work.experiences.Kitzuma.timeframe"),
                    role: t("about.work.experiences.Kitzuma.role"),
                    achievements: t("about.work.experiences.Kitzuma.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                },
                {
                    company: 'Business Enterprise Institute',
                    timeframe: t("about.work.experiences.BEI.timeframe"),
                    role: t("about.work.experiences.BEI.role"),
                    achievements: t("about.work.experiences.BEI.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                },
                {
                    company: 'Tiny Feet Toolkit',
                    timeframe: t("about.work.experiences.TinyFeet.timeframe"),
                    role: t("about.work.experiences.TinyFeet.role"),
                    achievements: t("about.work.experiences.TinyFeet.achievements").split(";"),
                    images: [], // actual project images come from MDX files
                }
            ]
        },
        studies: {
            display: true, // set to false to hide this section
            title: t("about.studies.title"),
            institutions: [
                {
                    name: 'Western Colorado University',
                    description: <>{t("about.studies.institutions.Western.description")}</>,
                    logo: '/logos/western.png'
                },
                {
                    name: 'State University of New York at Purchase',
                    description: <>{t("about.studies.institutions.Purchase.description")}</>,
                    logo: '/logos/purchaseCollege.png'
                }
            ]
        },
        technical: {
            display: false, // Hiding technical skills section
            title: t("about.technical.title"),
            skills: [
                {
                    title: 'Figma',
                    description: <>{t("about.technical.skills.Figma.description")}</>,
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
                    description: <>{t("about.technical.skills.Nextjs.description")}</>, // "." not accepted in next-intl namespace
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
        },
        certifications: {
            display: true,
            title: t("about.certifications.title"),
            certs: [
                {
                    name: t("about.certifications.certs.awsCloudPractitioner.name"),
                    issuer: t("about.certifications.certs.awsCloudPractitioner.issuer"),
                    issueDate: t("about.certifications.certs.awsCloudPractitioner.issueDate"),
                    expirationDate: t("about.certifications.certs.awsCloudPractitioner.expirationDate"),
                    credentialId: '6df0cb31-d027-4dc0-979e-bbf95c425646',
                    credentialURL: 'https://www.credly.com/badges/6df0cb31-d027-4dc0-979e-bbf95c425646/linked_in_profile',
                    description: t("about.certifications.certs.awsCloudPractitioner.description"),
                    image: '/images/certifications/aws-cloud-practitioner.png'
                }
            ]
        },
    }

    const blog = {
        label: t("blog.label"),
        title: t("blog.title"),
        description: t("blog.description", {name: person.name})
        // Create new blog posts by adding a new .mdx file to app/blog/posts
        // All posts will be listed on the /blog route
    }

    const work = {
        label: t("work.label"),
        title: t("work.title"),
        description: t("work.description", {name: person.name})
        // Create new project pages by adding a new .mdx file to app/blog/posts
        // All projects will be listed on the /home and /work routes
    }

    const gallery = {
        label: t("gallery.label"),
        title: t("gallery.title"),
        description: t("gallery.description", {name: person.name}),
        // Images from https://pexels.com
        images: []
    }
    return {
        person,
        social,
        newsletter,
        home,
        about,
        blog,
        work,
        gallery
    }
};

export { createI18nContent };
