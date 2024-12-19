import { renderContent } from "@/app/resources";
import { Flex, IconButton, SmartLink, Text } from "@/once-ui/components"
import { useTranslations } from "next-intl";
import styles from './Footer.module.scss'

interface FooterProps {
    person: {
        name: string;
        role: string;
        location: string;
        [key: string]: any;
    };
}

export const Footer: React.FC<FooterProps> = ({ person }) => {
    const currentYear = new Date().getFullYear();

    const t = useTranslations();
    const { social } = renderContent(t);

    return (
        <Flex
            as="footer"
            position="relative"
            fillWidth padding="8"
            justifyContent="center" mobileDirection="column">
            <Flex
                className={styles.mobile}
                fillWidth maxWidth="m" paddingY="8" paddingX="16" gap="16"
                justifyContent="space-between" alignItems="center">
                <Text
                    variant="body-default-s"
                    onBackground="neutral-strong">
                    <Text
                        onBackground="neutral-weak">
                        {currentYear} /
                    </Text>
                    <Text paddingX="4">
                        {person.name}
                    </Text>
                    <Text onBackground="neutral-weak">
                        {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
                        / <SmartLink style={{marginLeft: '-0.125rem', opacity: 0.3}} href="https://once-ui.com/templates/magic-portfolio">Once UI</SmartLink>
                    </Text>
                </Text>
                <Flex
                    gap="16">
                    {social.map((item) => (
                        item.link && (
                            <IconButton
                                key={item.name}
                                href={item.link}
                                icon={item.icon}
                                tooltip={item.name}
                                size="l"
                                variant="ghost"/>
                        )
                    ))}
                </Flex>
            </Flex>
            <Flex height="80" show="s"></Flex>
        </Flex>
    )
}