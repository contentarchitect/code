# Code

This is an block for ContentArchitect editor.

## Properties
- Syntax highlighting with [PrismJS](https://prismjs.com/)
- Editor side rendering. On viewing no require JS. Just HTML.

## Usage
You can create an bundle from [PrismJS Download Page](https://prismjs.com/download.html). And then click on **DOWNLOAD JS** and **DOWNLOAD CSS**. Then:

```html
<link rel="stylesheet" href="prism.css" />
<script src="prism.js"></script>

<script src="unpkg.com/@contentarchitect/editor"></script>
<script src="unpkg.com/@contentarchitect/code"></script>

<script>
ContentArchitect.Blocks.register(Code)
</script>

<content-architect>
  <div data-block="Code" data-lang="js">
    <pre>
      <code>
        // This is an code block    
      </code>
    </pre>
  </div>
</content-architect>
```

And now your code block ready.