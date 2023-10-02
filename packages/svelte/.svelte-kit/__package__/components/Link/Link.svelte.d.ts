/** @typedef {typeof __propDef.props}  LinkProps */
/** @typedef {typeof __propDef.events}  LinkEvents */
/** @typedef {typeof __propDef.slots}  LinkSlots */
export default class Link extends SvelteComponent<{
    inverted?: boolean;
    as?: string;
    className?: string;
    href?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type LinkProps = typeof __propDef.props;
export type LinkEvents = typeof __propDef.events;
export type LinkSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        inverted?: boolean;
        as?: string;
        className?: string;
        href?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
