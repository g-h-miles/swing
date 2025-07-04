/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as TestRouteImport } from './routes/test'
import { Route as SwingRouteImport } from './routes/swing'
import { Route as PlayerRouteImport } from './routes/player'
import { Route as IndexRouteImport } from './routes/index'

const TestRoute = TestRouteImport.update({
  id: '/test',
  path: '/test',
  getParentRoute: () => rootRouteImport,
} as any)
const SwingRoute = SwingRouteImport.update({
  id: '/swing',
  path: '/swing',
  getParentRoute: () => rootRouteImport,
} as any)
const PlayerRoute = PlayerRouteImport.update({
  id: '/player',
  path: '/player',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/player': typeof PlayerRoute
  '/swing': typeof SwingRoute
  '/test': typeof TestRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/player': typeof PlayerRoute
  '/swing': typeof SwingRoute
  '/test': typeof TestRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/player': typeof PlayerRoute
  '/swing': typeof SwingRoute
  '/test': typeof TestRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/player' | '/swing' | '/test'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/player' | '/swing' | '/test'
  id: '__root__' | '/' | '/player' | '/swing' | '/test'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PlayerRoute: typeof PlayerRoute
  SwingRoute: typeof SwingRoute
  TestRoute: typeof TestRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/test': {
      id: '/test'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof TestRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/swing': {
      id: '/swing'
      path: '/swing'
      fullPath: '/swing'
      preLoaderRoute: typeof SwingRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/player': {
      id: '/player'
      path: '/player'
      fullPath: '/player'
      preLoaderRoute: typeof PlayerRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PlayerRoute: PlayerRoute,
  SwingRoute: SwingRoute,
  TestRoute: TestRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
