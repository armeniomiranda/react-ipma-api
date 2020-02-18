import sleep from 'sleep-promise';

export function suspensify(promise) {
  let status = 'pending';
  let result;
  let suspender = promise.then(
    response => {
      status = 'success';
      result = response;
    },
    error => {
      status = 'error';
      result = error;
    }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      if (status === 'success') return result;
    }
  };
}

export function fetchRegion(id, local) {
  return fetch(
    `http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${id}.json`
  )
    .then(res => res.json())
    .then(res => ({
      ...res,
      local,
      results: res.data.map(forecast => ({
        ...forecast
      }))
    }))
    .then(sleep(500));
}

export function fetchRegionCollection() {
  return fetch(`http://api.ipma.pt/open-data/distrits-islands.json`)
    .then(res => res.json())
    .then(res => ({
      ...res,
      results: res.data.map(region => ({
        ...region
      }))
    }))
    .then(sleep(1000));
}
