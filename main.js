const { jarFromCookies } = require('insomnia-cookies');

module.exports.templateTags = [
  {
    name: 'cookieJar',
    displayName: 'CookieJar',
    description: 'reference cookie value from cookie jar',
    args: [
      {
        type: 'string',
        displayName: "Cookie Domain"
      },
      {
        type: 'string',
        displayName: "Cookie Key"
      }
    ],

    async run(context, cookieDomain, cookieName) {
      const { meta } = context;

      if (!meta.requestId || !meta.workspaceId) {
        return null;
      }

      const workspace = await context.util.models.workspace.getById(
        meta.workspaceId
      );

      if (!workspace) {
        throw new Error(`Workspace not found for ${meta.workspaceId}`);
      }

      const cookieJar = await context.util.models.cookieJar.getOrCreateForWorkspace(
        workspace
      );

      const cookie = cookieJar.cookies.find(cookie => cookie.domain == cookieDomain &&  cookie.key == cookieName);

      return cookie ? cookie.value : null;
    }
  }
];
