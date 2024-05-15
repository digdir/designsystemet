"use client";

import { Header } from "../components/Header/Header";
import { Container } from "react-bootstrap";
import classes from "./page.module.css";

export default function Home() {
  return (
    <div className={classes.page}>
      <Header />
      <main>
        <Container>
          <h1 className={classes.title}>Om verktøyet</h1>
          <p className={classes.ingress}>
            Dette er et test-verktøy som genererer farger basert på HSLUV
            fargespekteret og legger til RGB interpolasjon for å få menneskelige
            fine farger.
          </p>

          <h2>Logikk</h2>
          <ul>
            <li>
              Brukeren legger inn sin accent farge og verktøyet genererer alle
              fargene automatisk. Denne fargen blir lagt til som solid default i
              skalaen.
            </li>
            <li>
              <b>Solid hover og active:</b> 9 lumenance blir lagt til hover og
              18 lumenance til active fargen som standard basert på accent
              fargen. Om accent fargen har ein lumenance på mindre enn 30/100,
              så blir lumenance modifieren negativ (fargene blir lysere).
            </li>
            <li>
              <b>Solid hover og active (Dark mode):</b> Samme logikk som over.
            </li>
            <li>
              <b>Dark mode accent farge:</b> Om accent fargen som brukeren
              setter inn har ein lumenance på mindre enn 45/100, så blir accent
              fargen i darkmode accent + 10 lumenance.
            </li>
          </ul>
        </Container>
      </main>
    </div>
  );
}
