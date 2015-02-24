#[React-Waypoint Homepage](http://brigade.github.io/react-waypoint/)

##Adding Examples

1. Add an inline script to the bottom of `index.html` using the script type
   `text/jsx`. The in-browser JSX parser will parse your JSX. You must create a
   component in the global namespace that renders your example.
2. Add an `id` to your script tag that has the name of your example, lower
   cased and with dashes instead of spaces, followed by "-example-script" . Example:
   "Infinite Scroll" -> `infinite-scroll-example-script`
3. Add the lower-cased and dashed name of your example to the array passed for the `exampleNames` prop to
   `MultipleExamplesAndCode` when it is rendered into the
   `react-waypoint-examples` element in the last script of the page.
4. Add a condition to the `_renderExampleComponent` method in the
   `ExampleDemoAndCode` component, returning your component if the
   `exampleName` matches your lower-cased and dashed example name.
