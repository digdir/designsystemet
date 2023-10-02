/** @typedef {typeof __propDef.props}  ModalProps */
/** @typedef {typeof __propDef.events}  ModalEvents */
/** @typedef {typeof __propDef.slots}  ModalSlots */
export default class Modal extends SvelteComponent<{
    show?: boolean;
    title?: string;
}, {
    close: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type ModalProps = typeof __propDef.props;
export type ModalEvents = typeof __propDef.events;
export type ModalSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        show?: boolean;
        title?: string;
    };
    events: {
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
