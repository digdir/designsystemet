import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { Container } from '@repo/components';
import cl from 'clsx/lite';
import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

import classes from './Footer.module.css';

const centerLinks = [
    {
        text: 'designsystem@uppsala.se',
        url: 'mailto:designsystem@uppsala.se',
        prefix: 'E-post: ',
    },
    {
        text: 'Fler kontaktvägar',
        url: 'https://www.uppsala.se/lankar-i-sidfoten/kontakta-uppsala-kommun/',
    },
];

const rightLinks = [
    {
        text: 'Om webbplatsen',
        url: 'https://www.example.com/om-webbplatsen',
    },
    {
        text: 'Allmänna handlingar och diarium',
        url: 'https://www.example.com/allmanna-handlingar-diarium',
    },
    {
        text: 'Behandling av personuppgifter',
        url: 'https://www.example.com/behandling-av-personuppgifter',
    },
    {
        text: 'Kakor',
        url: 'https://www.example.com/kakor',
    },
    {
        text: 'Språk (other languages)',
        url: 'https://www.example.com/sprak-other-languages',
    },
    {
        text: 'Tillgänglighetsredogörelse',
        url: 'https://www.example.com/tillganglighetsredogorelse',
    },
];

type LinkListItemProps = {
    text: string;
    url: string;
    prefix?: ReactNode;
};

const LinkList = (links: LinkListItemProps[]) => {
    return (
        <ul className={classes.links}>
            {links.map((item, index) => (
                <li key={index}>
                    <Link href={item.url} color='neutral' className={classes.link}>
                        {item.prefix}
                        {item.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

const Footer = () => {
    return (
        <footer className={classes.footer} data-ds-color-mode='dark'>
            <div className={classes.top}>
                <Container className={classes.container}>
                    <div>
                        <Heading size='xs' level={2} className={classes.title}>
                            Kontakt
                        </Heading>
                        {LinkList(centerLinks)}
                    </div>
                    <div>
                        <Heading size='xs' level={2} className={classes.title}>
                            Om webbplatsen
                        </Heading>
                        {LinkList(rightLinks)}
                    </div>
                    <div></div>
                </Container>
            </div>
        </footer>
    );
};

export { Footer };
