import React from 'react';
import ErrorBoundary from './error-boundary';
import { fetchRegion, fetchRegionCollection, suspensify } from './api';
import { List } from './ui';
import { WeatherContext } from './weather';

const Forecast = React.lazy(() => import('./forecast'));

const initialRegion = suspensify(fetchRegion(1010500, 'Aveiro'));
const initialCollection = suspensify(fetchRegionCollection());

export default function App() {
  const [regionResource, setRegionResource] = React.useState(initialRegion);
  const [collectionResource] = React.useState(initialCollection);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [startTransition, isPending] = React.useTransition({ timeoutMs: 3000 });
  const deferredRegionResource = React.useDeferredValue(regionResource, {
    timeoutMs: 3000
  });

  const regionIsPending = deferredRegionResource !== regionResource;

  const regionState = {
    region: deferredRegionResource,
    isStale: regionIsPending,
    setRegion: (id, local) =>
      startTransition(() =>
        setRegionResource(suspensify(fetchRegion(id, local)))
      )
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container">
      <br />
      <WeatherContext.Provider value={regionState}>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback={<div>Fetching Forecast...</div>}>
            <ErrorBoundary fallback="Couldn't fetch forecast.">
              <Forecast />
            </ErrorBoundary>
          </React.Suspense>

          <React.Suspense fallback={<div>Fetching Regions...</div>}>
            <ErrorBoundary fallback="Couldn't fetch regions.">
              <br />
              <br />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
              <br />
              <WeatherContext.Consumer>
                {({ setRegion }) => (
                  <RegionCollection
                    resource={collectionResource}
                    as="ul"
                    className="region-list"
                    searchTerm={searchTerm}
                    renderItem={region => (
                      <li
                        key={region.globalIdLocal}
                        className="region-list-item"
                      >
                        <button
                          className="region-list-item-button"
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            setRegion(region.globalIdLocal, region.local)
                          }
                        >
                          <h3>{region.local}</h3>
                        </button>
                      </li>
                    )}
                  />
                )}
              </WeatherContext.Consumer>
            </ErrorBoundary>
          </React.Suspense>
        </React.SuspenseList>
      </WeatherContext.Provider>
    </div>
  );
}

function RegionCollection({ resource, searchTerm, ...props }) {
  const results = resource
    .read()
    .results.filter(region => region.local.toLowerCase().includes(searchTerm));

  return <List items={results} {...props} />;
}
