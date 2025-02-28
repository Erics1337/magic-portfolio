import { Avatar, Button, Flex, Heading, Icon, IconButton, SmartImage, Tag, Text } from '@/once-ui/components';
import { ReactNode } from 'react';
import { baseURL, renderContent } from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import styles from '@/components/about/about.module.scss'
import timelineStyles from './timeline.module.css';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { About, Institution, WorkExperience } from '@/app/types/about';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string }}
) {
    const t = await getTranslations();
    const { person, about } = renderContent(t);
	const title = about.title;
	const description = about.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/about`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default function About(
    { params: {locale}}: { params: { locale: string }}
) {
    unstable_setRequestLocale(locale);
    const t = useTranslations();
    const {person, about, social } = renderContent(t);
    const structure = [
        { 
            title: about.intro.title,
            display: about.intro.display,
            items: []
        },
        { 
            title: about.work.title,
            display: about.work.display,
            items: about.work.experiences.map(experience => experience.company)
        },
        { 
            title: about.studies.title,
            display: about.studies.display,
            items: about.studies.institutions.map(institution => institution.name)
        },
        { 
            title: about.technical?.title,
            display: about.technical?.display,
            items: about.technical?.skills?.map(skill => skill.name) || []
        },
        { 
            title: about.certifications.title,
            display: about.certifications.display,
            items: ["AWS Certified Cloud Practitioner", "AWS Certified AI Practitioner"]
        },
    ]
    return (
        <Flex
            fillWidth maxWidth="m"
            direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: person.name,
                        jobTitle: person.role,
                        description: about.intro.description,
                        url: `https://${baseURL}/about`,
                        image: `${baseURL}/images/${person.avatar}`,
                        sameAs: social
                            .filter((item) => item.link && !item.link.startsWith('mailto:')) // Filter out empty links and email links
                            .map((item) => item.link),
                        worksFor: {
                            '@type': 'Organization',
                            name: about.work.experiences[0].company || ''
                        },
                    }),
                }}
            />
            { about.tableOfContent.display && (
                <Flex
                    style={{ left: '0', top: '50%', transform: 'translateY(-50%)' }}
                    position="fixed"
                    paddingLeft="24" gap="32"
                    direction="column" hide="s">
                    <TableOfContents
                        structure={structure}
                        about={about} />
                </Flex>
            )}
            <Flex
                fillWidth
                mobileDirection="column" justifyContent="center">
                { about.avatar.display && (
                    <Flex
                        minWidth="160" paddingX="l" paddingBottom="xl" gap="m"
                        flex={3} direction="column" alignItems="center">
                        <Avatar
                            src={person.avatar}
                            size="xl"/>
                        <Flex
                            gap="8"
                            alignItems="center">
                            <Icon
                                onBackground="accent-weak"
                                name="globe"/>
                            {person.location}
                        </Flex>
                        { person.languages.length > 0 && (
                            <Flex
                                wrap
                                gap="8">
                                {person.languages.map((language, index) => (
                                    <Tag
                                        key={index}
                                        size="l">
                                        {language}
                                    </Tag>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                )}
                <Flex
                    className={styles.blockAlign}
                    fillWidth flex={9} maxWidth={40} direction="column">
                    <Flex
                        id={about.intro.title}
                        fillWidth minHeight="160"
                        direction="column" justifyContent="center"
                        marginBottom="32">
                        {about.calendar.display && (
                            <Flex
                                className={styles.blockAlign}
                                style={{
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--brand-alpha-medium)',
                                    width: 'fit-content'
                                }}
                                alpha="brand-weak" radius="full"
                                fillWidth padding="4" gap="8" marginBottom="m"
                                alignItems="center">
                                <Flex paddingLeft="12">
                                    <Icon
                                        name="calendar"
                                        onBackground="brand-weak"/>
                                </Flex>
                                <Flex
                                    paddingX="8">
                                    Schedule a call
                                </Flex>
                                <IconButton
                                    href={about.calendar.link}
                                    data-border="rounded"
                                    variant="tertiary"
                                    icon="chevronRight"/>
                            </Flex>
                        )}
                        <Heading
                            className={styles.textAlign}
                            variant="display-strong-xl">
                            {person.name}
                        </Heading>
                        <Text
                            className={styles.textAlign}
                            variant="display-default-xs"
                            onBackground="neutral-weak">
                            {person.role}
                        </Text>
                        {social.length > 0 && (
                            <Flex
                                className={styles.blockAlign}
                                paddingTop="20" paddingBottom="8" gap="8" wrap>
                                {social.map((item) => (
                                    item.link && (
                                        <Button
                                            key={item.name}
                                            href={item.link}
                                            prefixIcon={item.icon}
                                            label={item.name}
                                            size="s"
                                            variant="tertiary"/>
                                    )
                                ))}
                            </Flex>
                        )}
                    </Flex>

                    { about.intro.display && (
                        <Flex
                            direction="column"
                            textVariant="body-default-l"
                            fillWidth gap="m" marginBottom="xl">
                            {about.intro.description}
                        </Flex>
                    )}

                    { about.work.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.work.title}
                                variant="display-strong-s"
                                marginBottom="m">
                                {about.work.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l" marginBottom="40"
                                position="relative"
                                style={{ overflow: 'visible' }}>
                                <div className={timelineStyles.timeline} />
                                {about.work.experiences.map((experience, index) => (
                                    <Flex
                                        key={`${experience.company}-${experience.role}-${index}`}
                                        fillWidth
                                        direction="column"
                                        position="relative"
                                        style={{ 
                                            overflow: 'visible',
                                            minHeight: '100px'
                                        }}>
                                        <div 
                                            className={timelineStyles.timelineDot}
                                            key={`dot-${index}`}
                                            style={{ top: '24px' }} 
                                        />
                                        <Flex
                                            fillWidth
                                            justifyContent="space-between"
                                            alignItems="flex-end"
                                            marginBottom="4">
                                            <Text
                                                id={experience.company}
                                                variant="heading-strong-l">
                                                {experience.company}
                                            </Text>
                                            <Text
                                                variant="heading-default-xs"
                                                onBackground="neutral-weak">
                                                {experience.timeframe}
                                            </Text>
                                        </Flex>
                                        <Text
                                            variant="body-default-s"
                                            onBackground="brand-weak"
                                            marginBottom="m">
                                            {experience.role}
                                        </Text>
                                        <Flex
                                            as="ul"
                                            direction="column" gap="16">
                                            {experience.achievements.map((achievement, index) => (
                                                <Text
                                                    as="li"
                                                    variant="body-default-m"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                    key={`${experience.company}-${index}`}>
                                                    <span style={{ color: 'var(--neutral-text-light)' }}>•</span>
                                                    {achievement}
                                                </Text>
                                            ))}
                                        </Flex>
                                        {experience.images.length > 0 && (
                                            <Flex
                                                fillWidth paddingTop="m" paddingLeft="40"
                                                wrap>
                                                {experience.images.map((image, index) => (
                                                    <Flex
                                                        key={index}
                                                        border="neutral-medium"
                                                        borderStyle="solid-1"
                                                        radius="m"
                                                        style={{ 
                                                            minWidth: `${image.width}px`, 
                                                            height: `${image.height}px`, 
                                                            maxWidth: `${image.width}px`, 
                                                            maxHeight: `${image.height}px` 
                                                        }}>
                                                        <SmartImage
                                                            enlarge
                                                            radius="m"
                                                            sizes={image.sizes}
                                                            alt={image.alt}
                                                            src={image.src}/>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}

                    { about.studies.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.studies.title}
                                variant="display-strong-s"
                                marginBottom="m">
                                {about.studies.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l" marginBottom="40">
                                {about.studies.institutions.map((institution, index) => (
                                    <Flex
                                        key={institution.name}
                                        id={institution.name}
                                        fillWidth
                                        direction="row"
                                        gap="16"
                                        alignItems="flex-start">
                                        {institution.logo && (
                                            <Flex
                                                width="48"
                                                height="48"
                                                alignItems="center"
                                                justifyContent="center">
                                                <Image
                                                    src={institution.logo}
                                                    alt={`${institution.name} logo`}
                                                    width={48}
                                                    height={48}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Flex>
                                        )}
                                        <Flex
                                            fillWidth
                                            direction="column"
                                            gap="s">
                                            <Flex
                                                fillWidth
                                                justifyContent="space-between"
                                                alignItems="flex-end">
                                                <Heading variant="heading-strong-l">
                                                    {institution.name}
                                                </Heading>
                                                <Text
                                                    variant="heading-default-xs"
                                                    onBackground="neutral-weak">
                                                    {institution.name === "Western Colorado University" 
                                                        ? "2017 - 2020"
                                                        : "2010 - 2014"}
                                                </Text>
                                            </Flex>
                                            <Text variant="body-default-l">
                                                {institution.description}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}

                    { about.certifications.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.certifications.title}
                                variant="display-strong-s"
                                marginBottom="m">
                                {about.certifications.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l" marginBottom="40">
                                {[
                                    {
                                        name: "AWS Certified Cloud Practitioner",
                                        image: "/images/certifications/aws-cloud-practitioner.png",
                                        issuer: "Amazon Web Services (AWS)",
                                        credentialURL: "https://www.credly.com/badges/6df0cb31-d027-4dc0-979e-bbf95c425646/linked_in_profile"
                                    },
                                    {
                                        name: "AWS Certified AI Practitioner",
                                        image: "/images/certifications/aws-ai-practitioner.png",
                                        issuer: "Amazon Web Services (AWS)",
                                        credentialURL: "https://www.credly.com/badges/5b0a3df4-c87d-465d-894f-5fdd3c2c8d59/linked_in_profile"
                                    }
                                ].map((cert, index) => (
                                    <Flex
                                        key={cert.name}
                                        id={cert.name}
                                        fillWidth
                                        direction="row"
                                        gap="16"
                                        alignItems="center">
                                        <Image
                                            src={cert.image}
                                            alt={cert.name}
                                            width={64}
                                            height={64}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <Flex direction="column" gap="s">
                                            <Heading variant="heading-strong-l">
                                                {cert.name}
                                            </Heading>
                                            <Text variant="body-default-l">
                                                {cert.issuer}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}

                    { about.technical.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.technical.title}
                                variant="display-strong-s" marginBottom="40">
                                {about.technical.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l">
                                {about.technical.skills.map((skill, index) => (
                                    <Flex
                                        key={`${skill.title}-${index}`}
                                        id={skill.title}
                                        fillWidth gap="4"
                                        direction="column">
                                        <Text
                                            variant="heading-strong-l">
                                            {skill.title}
                                        </Text>
                                        <Text
                                            variant="body-default-m"
                                            onBackground="neutral-weak">
                                            {skill.description}
                                        </Text>
                                        {skill.images.length > 0 && (
                                            <Flex
                                                fillWidth paddingTop="m" gap="12"
                                                wrap>
                                                {skill.images.map((image, index) => (
                                                    <Flex
                                                        key={index}
                                                        border="neutral-medium"
                                                        borderStyle="solid-1"
                                                        radius="m"
                                                        style={{ 
                                                            minWidth: `${image.width}px`, 
                                                            height: `${image.height}px`, 
                                                            maxWidth: `${image.width}px`, 
                                                            maxHeight: `${image.height}px` 
                                                        }}>
                                                        <SmartImage
                                                            enlarge
                                                            radius="m"
                                                            sizes={image.sizes}
                                                            alt={image.alt}
                                                            src={image.src}/>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}