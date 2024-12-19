export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Redirect root to /en/
    if (url.pathname === '/') {
      return Response.redirect(`${url.origin}/en/`, 302);
    }

    // Handle other routes
    let response = await env.ASSETS.fetch(request);
    
    // If not found and doesn't end with a slash, try adding a slash
    if (response.status === 404 && !url.pathname.endsWith('/')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = newUrl.pathname + '/';
      response = await env.ASSETS.fetch(new Request(newUrl, request));
    }

    // If still not found and doesn't start with /en/, try prepending /en/
    if (response.status === 404 && !url.pathname.startsWith('/en/')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = '/en' + newUrl.pathname;
      response = await env.ASSETS.fetch(new Request(newUrl, request));
    }

    return response;
  }
}
