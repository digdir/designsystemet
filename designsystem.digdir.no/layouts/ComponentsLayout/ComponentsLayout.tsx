import Header from '../../components/Header/Header';
import React from "react";
import Section from "../../components/Section/Section";
import {Col, Container, Row} from "react-bootstrap";
import NavigationCard from "../../components/NavigationCard/NavigationCard";
import Banner from "../../components/Banner/Banner";
import {SidebarMenu} from "../../components/SidebarMenu/SidebarMenu";
import {ComponentOverview} from "../../components/ComponentOverview/component-overview";

import classes from './ComponentsLayout.module.css'

interface ComponentsLayoutProps {
    Content: React.ReactNode;
    data: any;
}

interface ComponentsLayoutData {
    title: string;
    description: string;
    navigationCards: {
        title: string;
        items: any[]
    };
}

const ComponentsLayout = ({ Content, data }: ComponentsLayoutProps) => {
    return (
        <div>
            <Header />
            <div className={classes.content}>
                <Container>
                    <Row>
                        <Col md={2}>
                            <div className={classes.menus}>
                                <SidebarMenu title='Komponenter' />
                            </div>
                        </Col>
                        <Col md={9}>
                            <div>
                                <h1 className={classes.title}>{data.title}</h1>
                                <p className={classes.desc}>{data.description}</p>
                                <ComponentOverview />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {Content}
        </div>
    );
};

export {ComponentsLayout};
export type { ComponentsLayoutData };

