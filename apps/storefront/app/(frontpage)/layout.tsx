import { Heading } from '@digdir/designsystemet-react';
import { ComponentIcon, PaletteIcon, WrenchIcon } from '@navikt/aksel-icons';
import { Container } from '@repo/components';
import cn from 'clsx/lite';
import type React from 'react';

import { NavigationCard } from '@components';

import classes from './layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main id='main'>
            <div className={classes.header}>
                <div
                    className={classes.content}
                    /* Vi behöver detta för Firefox, eftersom det fokuserar på allt med overflow: hidden */
                    tabIndex={-1}
                >
                    <Container className={classes.container}>
                        <div className={classes.text}>
                            <div className={classes.betaTag}>Under utveckling</div>
                            <Heading size='lg'>
                                Designsystsemet hjälper dig att skapa bra digitala tjänster
                            </Heading>
                        </div>
                        <div className={classes.cards}>
                            <NavigationCard
                                title='Komponenter'
                                description='Se översikten över UI-komponenterna som är gjorda i React.'
                                color='red'
                                url='/komponenter'
                                icon={<ComponentIcon fontSize={34} />}
                                level={2}
                            ></NavigationCard>
                        </div>
                    </Container>
                </div>
            </div>
            {children}
        </main>
    );
};

export default Layout;
