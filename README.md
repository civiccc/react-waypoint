#[React-Waypoint Homepage](http://brigade.github.io/react-waypoint/)

##Adding Examples

1. Choose a name for your example. If your example is about infinite scroll,
   then you would follow the following naming conventions:
   component name                                   -> `InfiniteScrollExample`
   example name prop for `MultipleExamplesAndCode`  -> "infinite-scroll"
   id of your script tag                            -> "infinite-scroll-example-script"
2. Add an inline script to the bottom of `index.html` using the script type
   `text/jsx`. The in-browser JSX parser will parse your JSX. You must create a
   component in the global namespace that renders your example, and has the
   naming convention '__something__Example'.
3. Add an `id` to your script tag that has the name of your example, lower
   cased and with dashes instead of spaces, followed by "-example-script".
   Example: "Infinite Scroll" -> "infinite-scroll-example-script"
4. Add the lower-cased and dashed name of your example to the array passed for the `exampleNames` prop to
   `MultipleExamplesAndCode` when it is rendered into the
   `react-waypoint-examples` element in the last script of the page.
5. Add any styles for your example to the `styles` directory and require them in
   the `head` element of `index.html`.
