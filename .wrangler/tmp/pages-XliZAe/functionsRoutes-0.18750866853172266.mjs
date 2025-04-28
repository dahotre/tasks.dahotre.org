import { onRequestGet as __api_tasks_js_onRequestGet } from "/Users/dahotrea/IdeaProjects/tasks.dahotre.org/functions/api/tasks.js"
import { onRequestPost as __api_tasks_js_onRequestPost } from "/Users/dahotrea/IdeaProjects/tasks.dahotre.org/functions/api/tasks.js"

export const routes = [
    {
      routePath: "/api/tasks",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_tasks_js_onRequestGet],
    },
  {
      routePath: "/api/tasks",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_tasks_js_onRequestPost],
    },
  ]