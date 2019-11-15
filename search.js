const searchClient = algoliasearch('B1G2GM9NG0', 'aadef574be1f9252bb48d4ea09b5cfe5');

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),


    instantsearch.widgets.currentRefinements({
      container: '#current-refinements',
    }),
  
    instantsearch.widgets.refinementList({
      container: '#brand-list',
      attribute: 'brand',
    }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        // empty: 'No results for <q>${query}</q>',
        templates: {
            item: `
              <div>
                <img src="{{image}}" align="left" alt="{{name}}" />
                <div class="hit-name">
                  {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
                </div>
                <div class="hit-description">
                  {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
                </div>
                <div class="hit-price">\${{price}}</div>
              </div>
            `,
        } 
    }
  }),

  instantsearch.widgets.searchBox({
    container:' #searchbox',
    // // Optional parameters
    placeholder: 'Search Products and Brands',
    showLoadingIndicator: true,
    // queryHook: function,
    // templates: object,
    // cssClasses: object,
  })
]);

search.start();