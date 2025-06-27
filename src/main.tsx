import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'
import WindowSelector from './components/window-selector.tsx'
import { Plain } from './components/plain.tsx'



const queryClient = new QueryClient()



const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {

    return (

    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )},
})


const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const selectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/selector',
  component: WindowSelector,
})

const plainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plain',
  component: Plain,
})

const routeTree = rootRoute.addChildren([indexRoute, selectorRoute, plainRoute])




const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
