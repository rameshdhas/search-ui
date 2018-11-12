# React Search UI tutorial

## Basics

Create a new React application with create-react-app

```
npm install -g create-react-app
create-react-app search-ui-tutorial
cd search-ui-tutorial
yarn start
```

That should open up a new window with http://localhost:3000/ running.

Now you'll need to install search-ui. Because it's not published to npm yet, the install will be a little weird

```shell
cd ..
git clone git@github.com:elastic/search-ui.git
cd search-ui
npm install
npx lerna bootstrap
cd ../search-ui-tutorial
npm install ../search-ui/packages/search-ui-app-search-connector/
npm install ../search-ui/packages/search-ui/
npm install ../search-ui/packages/react-search-components/
npm install ../search-ui/packages/react-search-ui/
```

Once this is published this process would just be a 1 liner:

```shell
npm install @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

Cool. Now back to your `search-ui-tutorial`, you can start using the library.

In App.js

Create a connector, create some basic configuration for Search UI, and initialize a Provider.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider } from "@elastic/react-search-ui";

const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
  hostIdentifier: "host-2376rb"
});

export default function App() {
  return (
    <SearchProvider
      config={{
        apiConnector: connector
      }}
    >
      {_ => <div className="App">{/*We'll add our components here*/}</div>}
    </SearchProvider>
  );
}
```

At this point, you have the bare minimum configured to get working. You can just start dropping components from `react-search-ui` in. As long as these components are nested somewhere inside of SearchProvider, they will be connected to the search experience.

(More on SearchProvider here: https://github.com/elastic/search-ui/tree/master/packages/react-search-ui#example, including configuration)

I haven't documented all of the components yet, so you'll have to look here to see the list:
https://github.com/elastic/search-ui/tree/master/packages/react-search-ui/src/containers

To start off, just put a `SearchBox` and a `Results` container on the page.

```jsx
import { SearchProvider, SearchBox, Results } from "@elastic/react-search-ui";

...

<div className="App">
  <SearchBox />
  <Results />
</div>
```

Now go to your browser. You should see a search box. Search for something. You should see results appear below.

Whaaat?? You see that? How cool is that? Super easy right?

Note that in addition to the UI, you also have URL state being tracked. Try performing a search, then refreshing the page. Rad right? You get full url state management for free. This, however, IS optional. Not everyone will want to use that. There is a flag (`trackURLState`) to turn it off in the SearchProvider [configuration](https://github.com/elastic/search-ui/blob/master/packages/search-ui/README.md#driverconfig).

## Styles and Markup

Another thing you may have noticed is that this looks like shit. We'll provide the following for Search UI:

1. A stylesheet containing basic styles for all components and layout
2. A few layout components to help layout a basic search page. Basically, enough to implement the Reference UI.

All of this is provided by `@elastic/react-search-components`.

Add the following:

```jsx
import { Body, Header } from "@elastic/react-search-components";
import "@elastic/react-search-components/lib/styles/styles.css";

<Header>
  <SearchBox />
</Header>
<Body bodyContent={<Results />}/>
```

OK, now you should see the same functionality, but with some styles. Results
has some additional parameters we can configure. Additionally, we could now
add Paging and PagingInfo.

```jsx
import {
  ...
  PagingInfo,
  ResultsPerPage,
  Paging
} from "@elastic/react-search-ui";

...

<Header>
  <SearchBox />
</Header>
<Body
  bodyContent={<Results titleField="title" urlField="nps_link" />}
  bodyHeader={
    <div className="meta">
      <PagingInfo />
      <ResultsPerPage />
    </div>
  }
  bodyFooter={<Paging />}
/>
```

Do you follow what we did? We just used `Header` and `Body` to layout the page.
Most people probably wouldn't event use these, unless they're really expecting
something completely out of the box.

`PagingInfo`, `ResultsPerPage`, and `Paging` are pretty standard search ui
components.

`titleField` just lets use specify which field we want to use as the title, and
ditto for urlField, but for the link in the `Results`.

Note that using the `Results` component is really just a convenience. We could
choose to iterate over results ourselves and show results any way we choose, OR,
use the `Results` component and just override the view with our own markup.

## Facets

Add a facet. Update config first. Let's add a facet filter on states. And let's
also add a range filter for acres. Adding facets is just like configuring
facets for the API, but we support a couple of additional [options].(https://github.com/elastic/search-ui/tree/master/packages/search-ui#facet-configuration-)

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
    facetConfig: {
      states: { type: "value", size: 30 },
      acres: {
        type: "range",
        ranges: [
          { from: -1, name: "Any" },
          { from: 0, to: 1000, name: "Small" },
          { from: 1001, to: 100000, name: "Medium" },
          { from: 100001, name: "Large" }
        ]
      }
    }
  }}
>
```

Adding that config just makes the data available. We'll actually need
to add components on the page in order to take advantage of those facets.

```jsx
import {
  ...
  Facet
} from "@elastic/react-search-ui";
import {
  ...
  MultiValueFacet,
  SingleRangeSelectFacet
} from "@elastic/react-search-components";

...

<Body
  sideContent={
    <div>
      <Facet field="states" label="States" render={MultiValueFacet} />
      <Facet
        field="acres"
        label="Acres"
        render={SingleRangeSelectFacet}
      />
    </div>
  }
  ...
</Body>
```

FYI, Facet components are one area that still need work. The way we name them,
the way we consume them, etc. Additionally, all facets now are considered "AND"
filters. I'm thinking we should add a configuration at the component level to
configure whether making a selection makes an OR selection or an AND selection.

OK, so, you have facets. Use them. What do you think? Personally, I don't think
that range facet is quite right. Play around with it, you'll see what I mean...

This is because that facet needs to be disjunctive. Add `disjunctive: true` to
the `acres` config in `facetConfig`. That should help

## View customization

OK, so, one more thing. Functionality is great, but let's change the view component
for the `states` facet. ALL components in `react-search-ui` will support a
`render` prop, which lets you customize the view. We're just going to swap in
another view component that provides slightly different markup.

```jsx
import {
  ...
  SingleValueLinksFacet
} from "@elastic/react-search-components";

...

<Facet
  field="states"
  label="States"
  show={10}
  render={SingleValueLinksFacet}
/>
```

OK, now, take a look at what you've done. You've just re-created the Reference UI!