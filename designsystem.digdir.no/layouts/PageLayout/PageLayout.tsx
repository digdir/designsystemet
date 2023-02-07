import Header from '../../components/Header/Header';
import React from "react";
import Section from "../../components/Section/Section";
import {Container, Row, Col} from "react-bootstrap";
import NavigationCard from "../../components/NavigationCard/NavigationCard";
import {Picture, Wrench, System} from "@navikt/ds-icons";

import classes from './PageLayout.module.css'

interface PageLayoutProps {
    Content: React.ReactNode;
}

const PageLayout = ({ Content }: PageLayoutProps) => {
    return (
        <div>
            <Header />
            <main className={classes.content}>
                <Container>
                    <Row>
                        <Col md={2}>
                            <div className={classes.list}>
                                <h3>Styling</h3>
                                <ul>
                                    <li><a href="">Design Tokens</a></li>
                                    <li><a href="">Farger</a></li>
                                    <li><a href="">Typografi</a></li>
                                </ul>
                            </div>
                            <div className={classes.list}>
                                <h3>Design</h3>
                                <ul>
                                    <li><a href="">Kom i gang i Figma</a></li>
                                    <li><a href="">Interaksjonsprinsipper</a></li>
                                    <li><a href="">Mønstre</a></li>
                                </ul>
                            </div>
                        </Col>
                        <Col md={7} className={classes.test}>
                            {Content}
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default PageLayout;