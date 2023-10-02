/** @typedef {typeof __propDef.props}  ParagraphProps */
/** @typedef {typeof __propDef.events}  ParagraphEvents */
/** @typedef {typeof __propDef.slots}  ParagraphSlots */
export default class Paragraph extends SvelteComponent<{
    [x: string]: any;
    as?: string;
    spacing?: boolean;
    short?: boolean;
    size?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type ParagraphProps = typeof __propDef.props;
export type ParagraphEvents = typeof __propDef.events;
export type ParagraphSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        as?: string;
        spacing?: boolean;
        short?: boolean;
        size?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
