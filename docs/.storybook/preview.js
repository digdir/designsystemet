import customTheme from './customTheme.js';
import './inter.css';
import './customStyling.css';
import React from 'react';
import {DocsContainer} from '@storybook/addon-docs';
import {BackToTop, TableOfContents} from 'storybook-docs-toc';
import {Tomato} from "../components/TableOfContents/TableOfContents";
import "@altinn/figma-design-tokens/dist/tokens.css";


export const parameters = {
    layout: 'centered',
    actions: {argTypesRegex: '^on[A-Z].*'},
    docs: {
        theme: customTheme,
        container: ({children, ...rest}) => (
            <React.Fragment>
                <DocsContainer {...rest}>
                    <Tomato />
                    {children}
                </DocsContainer>
            </React.Fragment>
        ),
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    options: {
        storySort: {
            order: [
                'Introduksjon',
                'Design Tokens',
                'Core components',
                ['Introduksjon', 'Button'],
                'Changelog',
                ['Design Tokens', 'Core components', 'Web components'],
            ],
        },
    },
};
