async function logAllRoutes(appInstance) {
  const routerStack = (await appInstance.router)
    ? appInstance.router.stack
    : appInstance._router.stack;

  if (!routerStack) {
    console.warn(
      "⚠️ Could not access router stack. No routes might be registered yet, or Express version is incompatible."
    );
    return;
  }

  const routes = [];
  routerStack.forEach((middleware) => {
    if (middleware.route) {
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods)
        .join(", ")
        .toUpperCase();
      routes.push({ method: methods, path: `/api/v1${path}` });
    } else if (middleware.name === "router") {
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods)
              .join(", ")
              .toUpperCase();
            routes.push({ method: methods, path: `/api/v1${path}` });
          }
        });
      }
    }
  });

  console.log("\n✨ All Registered API Routes:\n");
  if (routes.length === 0) {
    console.log("😓 No routes registered.");
  } else {
    routes.forEach((route, index) => {
      console.log(`🌿 ${index + 1} [${route.method}] ${route.path}`);
    });
  }
}

module.exports = { logAllRoutes };
