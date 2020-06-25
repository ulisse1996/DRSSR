import { ReactDOMServer, obfuscator } from "./deps.ts";

export interface RenderOptions {
    imports? : ReactImport
    production : boolean
}

interface ReactImport {
    react : string,
    reactDom : string
}

export interface ReactType {
    type:  string | Function;
    key:   string;
    ref:   string;
    props: Props;
}

export interface Props {
    children?: ReactType[] | ReactType;
}

const DEFAULT_IMPORTS = {
    react : "https://dev.jspm.io/react@16.13.1",
    reactDom : "https://dev.jspm.io/react-dom@16.13.1"
}

export class Page {

    private imports : ReactImport;
    private components : Function[];
    private prod : boolean;
    private element : JSX.Element;

    private constructor(imports : ReactImport, components: Function[], production: boolean, element : JSX.Element) {
        this.imports = imports;
        this.components = components;
        this.prod = production;
        this.element = element;
    }

    static fromElement(element: JSX.Element, options?: RenderOptions) : Page {
        const type = element.type() as ReactType;

        const customTypes = this.parseTree(type);

        const customImports = options?.imports || DEFAULT_IMPORTS;

        return new Page(customImports, customTypes, options?.production || false, element);
    }

    private static parseTree(element : ReactType) : Function[] {
        const custom : Function[] = [];

        // Not a react DOM type (a string)
        if (element.type instanceof Function) {
            custom.push(element.type)
        }

        if (element.props?.children) {
            if (element.props.children instanceof Array) {
                custom.push(...element.props.children.flatMap(item => this.parseTree(item)));
            } else {
                custom.push(...this.parseTree(element.props.children));
            }
        }

        return custom;
    }

    html() : string {
        return (ReactDOMServer as any).renderToString(this.element);
    }

    script(elementId : string = 'app') : string {
        const script = `import React from '${this.imports.react}';import ReactDOM from '${this.imports.reactDom}';${this.components.map(comp  => `const ${comp.name} = ${comp}`).join(';')}const app = ${this.element.type};ReactDOM.hydrate(React.createElement(app), document.getElementById('${elementId}'));`;
        if (this.prod) {
            return (obfuscator as any).obfuscate(script.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ')).toString();
        }

        return script.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
    }
}