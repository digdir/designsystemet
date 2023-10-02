/** @typedef {typeof __propDef.props}  AlertProps */
/** @typedef {typeof __propDef.events}  AlertEvents */
/** @typedef {typeof __propDef.slots}  AlertSlots */
export default class Alert extends SvelteComponent<{
    severity?: string;
    elevated?: boolean;
    iconTitle?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type AlertProps = typeof __propDef.props;
export type AlertEvents = typeof __propDef.events;
export type AlertSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        severity?: string;
        elevated?: boolean;
        iconTitle?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
