"use client";

import classes from "./page.module.css";
import { Preview } from "../components/Preview/Preview";
import { Header } from "../components/Header/Header";
import { ScaleRow } from "../components/ScaleRow/ScaleRow";

export default function Home() {
  return (
    <div>
      <Header />
      <main className={classes.main}>
        <h1 className={classes.title}>Liste over fargeskalaer</h1>
        <ScaleRow name="Accent" color="#0062BA" showHeader themeMode="light" />
        <ScaleRow
          name="Accent darkmode"
          color="#0062BA"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Success" color="#2BA63C" showHeader themeMode="light" />
        <ScaleRow
          name="Success darkmode"
          color="#2BA63C"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Warning" color="#ECC238" showHeader themeMode="light" />
        <ScaleRow
          name="Warning darkmode"
          color="#ECC238"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Danger" color="#B32728" showHeader themeMode="light" />
        <ScaleRow
          name="Danger darkmode"
          color="#B32728"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Brand 1" color="#F45F63" showHeader themeMode="light" />
        <ScaleRow
          name="Brand 1 darkmode"
          color="#F45F63"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Brand 2" color="#E5AA20" showHeader themeMode="light" />
        <ScaleRow
          name="Brand 2 darkmode"
          color="#E5AA20"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Brand 3" color="#1E98F5" showHeader themeMode="light" />
        <ScaleRow
          name="Brand 3 darkmode"
          color="#1E98F5"
          showHeader
          themeMode="dark"
        />

        <ScaleRow
          name="Mattilsynet"
          color="#054449"
          showHeader
          themeMode="light"
        />
        <ScaleRow
          name="Mattilsynet darkmode"
          color="#054449"
          showHeader
          themeMode="dark"
        />

        <ScaleRow name="Brreg" color="#133349" showHeader themeMode="light" />
        <ScaleRow
          name="Brreg darkmode"
          color="#133349"
          showHeader
          themeMode="dark"
        />

        <ScaleRow
          name="Arbeidstilsynet"
          color="#086057"
          showHeader
          themeMode="light"
        />
        <ScaleRow
          name="Arbeidstilsynet darkmode"
          color="#086057"
          showHeader
          themeMode="dark"
        />

        {/* <Preview colors={colors} /> */}
      </main>
    </div>
  );
}
