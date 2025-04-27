const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { get } = require('http');
const { type } = require('os');

module.exports = {  
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('src/popup/popup.tsx'), // entry point for the popup
        options: path.resolve('src/options/options.tsx'), // entry point for the options page
        background: path.resolve('src/background/background.ts'), // entry point for the background script
        contentScript: path.resolve('src/contentScript/contentScript.ts'), // entry point for the content script
    },
    module: {
        rules: [{
            use: 'ts-loader',
            test: /\.tsx?$/,
            exclude: /node_modules/,
        }, 
        {
            use: ['style-loader', 'css-loader'],
            test: /\.css$/i,
        },
        {
            type: 'asset/resource',
            test: /\.(png|jpeg|gif|svg|woff|woff2|eot|ttf)$/,
        }
    ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('src/static'),
                  to : path.resolve('dist'),   
                } 
                
            ],
         }),
         ...getHtmlPlugins([
            'popup', 'options'

         ]), // array of html plugins for each entry point

    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }, 
    output: {
        filename: '[name].js',
        path: path.resolve('dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
          
        },
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'AnyRay Extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
        templateContent: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>AnyRay Extension</title>
            </head>
            <body>
              <div id="${chunk === 'options' ? 'options-root' : 'root'}"></div>
            </body>
          </html>
        `
    }));
}
