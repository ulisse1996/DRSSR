# Deno React Sever Side Rendering

DRSSR is a simple dependency for convert a React Component in a plain string that can be injected in a HTML page. DRSSR also produce a simple or obfuscated chunk of code for hydrate React functionality for client side.

It can be used with a framework like [Oak]('https://deno.land/x/oak') for create dynamic or static page.

### Example
```typescript
    const app = () => {
        return (
            <div>
                <h1>Hello World</h1>
            </div>
        )
    }

    const page = render(<App />);

    const pageProd = render(<App />, {production : true})

    page.html(); // Return string representation of App component

    page.script('app'); // Return js chunk of code for hydrate React component and attach this component to element identified by 'app'

    pageProd.script('app'); // Return an obfuscate js chunk of code for hydrate React component and attach this component to element identified by 'app'
    
```
