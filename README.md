# Robot Log Enhancer

Robot Log Enhancer is a lightweight JavaScript module designed to enhance the functionality of robot log files. Built with Vite and Svelte, it compiles into a single file JavaScript module (`./dist/robot-log-enhancer.umd.js`) that can be easily integrated into any HTML page.

## Features

- **Footer Page**: Adds a customizable footer to the robot log HTML file.
- **Keyword Collapsing**: Includes a button to collapse or expand children of keywords like "Wait until..", improving readability and navigation.
- **Test Navigation**: Displays the current test name and provides "Previous" and "Next" buttons for easy navigation between tests.

## Installation

To use Robot Log Enhancer in your project, simply include the following script tag in the body of your HTML page:

```html
<script src="https://cdn.jsdelivr.net/gh/brequet/robot-log-enhancer-module/dist/robot-log-enhancer.umd.js"></script>
```

## Building the Module

To build the module yourself, follow these steps:

1. Clone the repository.
2. Run `pnpm install` to install dependencies.
3. Use the command `pnpm run build` to compile the project. The output will be `dist/robot-log-enhancer.umd.js`.
