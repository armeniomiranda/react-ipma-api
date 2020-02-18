import React from 'react';
import { DelaySpinner } from './ui';
import { WeatherContext } from './weather';

export default function Forecast() {
  let { region: resource, isStale } = React.useContext(WeatherContext);
  let region = resource.read();

  return (
    <article style={isStale ? { opacity: 0.5 } : null}>
      <section className="forecast-header">
        <h2 className="forecast-title">
          {region.local} {isStale && <DelaySpinner />}
        </h2>
      </section>

      <section>
        {region.results.map(({ tMin, tMax, precipitaProb, forecastDate }) => (
          <>
            <h4>{forecastDate}</h4>
            <div className="forecast-grid">
              <div className="forecast-item">
                <span className="forecast-item-header">{tMin}&#8451;</span>
                <span className="forecast-item-body">Minimum temperature</span>
              </div>
              <div className="forecast-item">
                <span className="forecast-item-header">{tMax}&#8451;</span>
                <span className="forecast-item-body">Maximum temperature</span>
              </div>
              <div className="forecast-item">
                <span className="forecast-item-header">
                  {precipitaProb}&#37;
                </span>
                <span className="forecast-item-body">% Precipitation</span>
              </div>
            </div>
          </>
        ))}
      </section>
    </article>
  );
}
