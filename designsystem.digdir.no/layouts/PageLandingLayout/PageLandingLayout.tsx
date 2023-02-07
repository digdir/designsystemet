import Header from '../../components/Header/Header';
import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import NavigationCard from "../../components/NavigationCard/NavigationCard";
import {Picture, Wrench, System} from "@navikt/ds-icons";

import classes from './PageLandingLayout.module.css'

interface PageLandingLayoutProps {
    Content: React.ReactNode;
    data: any;
}

interface PageLandingLayoutData {
    title: string;
    description: string;
    items: any[];
}

const PageLandingLayout = ({ Content, data }: PageLandingLayoutProps) => {
    return (
        <div>
            <Header />
            {Content}
            <div className={classes.content}>
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
                        <Col md={10} className={classes.test}>
                           <h1 className={classes.title}>{data.title}</h1>
                            <p className={classes.desc}>{data.description}</p>
                                <Row className="gy-4">
                                    {data.items.map((item: any, index: number) => (
                                        <Col key={index} md={4}>
                                            <NavigationCard backgroundColor='grey' title={item.title} color={item.color} icon={<Picture fontSize={28} />} />
                                        </Col>
                                    ))}
                                </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export {PageLandingLayout};
export type { PageLandingLayoutData };

