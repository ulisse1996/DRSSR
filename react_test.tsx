import {assert, assertEquals} from "https://deno.land/std/testing/asserts.ts";
import { React } from './deps.ts';
import { Page } from './react.ts';

const { test } = Deno;

test("Should return same html/script structure", () => {
    const App = () => {
        return (
            <div>
                <h1>Hello World</h1>
            </div>
        )
    }

    const expectedHtml = '<div data-reactroot=\"\"><h1>Hello World</h1></div>';
    const expectedScript = `import React from 'https://dev.jspm.io/react@16.13.1';import ReactDOM from 'https://dev.jspm.io/react-dom@16.13.1';const app = () => { return (React.createElement(\"div\", null,  React.createElement(\"h1\", null, \"Hello World\"))); };ReactDOM.hydrate(React.createElement(app), document.getElementById('app'));`;

    const page = Page.fromElement(<App />);
    const prodPage = Page.fromElement(<App />, {production : true})

    assertEquals(expectedHtml, page.html());
    assertEquals(expectedScript, page.script('app'));

    assertEquals(prodPage.html(),expectedHtml);
    assert(prodPage.script('app') !== expectedScript);
})