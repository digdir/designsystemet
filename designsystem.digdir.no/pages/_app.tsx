import 'bootstrap/dist/css/bootstrap.css'
import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'tippy.js/dist/tippy.css';
import '@altinn/figma-design-tokens/dist/tokens.css'
import '../globals.css';
import { Inter } from '@next/font/google'

import type { AppProps } from 'next/app';
import {Container} from "react-bootstrap";

const inter = Inter({
    weight: ['400', '500', '600', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: "fallback",
})

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <main className={inter.className}>
            <Component {...pageProps} />
            <footer>
                <Container>
                    <img src="/logo-white.png" alt="Logo"/> Felles Designsystem © 2023
                </Container>
            </footer>
        </main>
    );
}

export default MyApp;
