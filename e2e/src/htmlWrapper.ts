import { State } from '../src/index'

export const htmlWrapper = (state: State) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>e2e</title>
    </head>
    <body>
      <style>
        html {
          width: 100%;
          height: 100%;
        }

        body {
          background-color: red;
          margin: 0;

          width: 100%;
          height: 100%;

          display: flex;
        }

        #canvas-engine {
          flex: 1;
          position: relative;
        }
      </style>

      <script type="module">
        import { runOneFrame } from '../../dist/canvas-engine.cjs.development.js'
        
        initializeEngine().then(() => {
          const state = ${JSON.stringify(state)};
          runOneFrame(state);
        })
      </script>
    </body>
  </html>
`
