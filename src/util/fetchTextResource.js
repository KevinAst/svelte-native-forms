/**
 * Fetch a text-based resource from the supplied URL.
 *
 * NOTE: The cr/lf of the returned resource is normalized.
 * 
 * @param {string} url - the url of the resource to fetch.
 *
 * @return {string} the text-based resource (via a promise).
 * 
 * @throws {Error} an Error is thrown when the fetch was unsuccessful.
 */
export default async function fetchTextResource(url) {
  // issue the fetch
  const resp = await fetch(url);

  // console.log(`XX fetchTextResource('${url}') ... resp.ok: ${resp.ok}, resp.status: ${resp.status} ... resp: `, resp);
  if (!resp.ok) {
    throw new Error(`**ERROR** fetchTextResource('${url}') status: ${resp.status}`);
  }
  
  // convert response to text
  const code = await resp.text();

  // console.log(`XX fetchTextResource('${url}'):\n`, code);

  // normalize cr/lf
  // ... the humble line break has THREE forms (based on OS and environment):
  //     - UNIX:    \n
  //     - MAC OS:  \r
  //     - WINDOWS: \r\n
  // ... NOTE: the WINDOWS version is causing extra lines in the <HighlightSvelte> component
  const normalizedCRLF = code.replaceAll('\r\n', '\n');

  // that's all folks :-)
  return normalizedCRLF;
}
