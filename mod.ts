import { Page, RenderOptions } from "./react.ts";

export function render(component: JSX.Element, options: RenderOptions = {production : false}) : Page {
    return Page.fromElement(component, options);
}
