import type { RouteMeta } from '../types';

// 路由配置
export interface RouteConfig {
  path: string;
  name?: string;
  component?: any;
  meta?: RouteMeta;
  children?: RouteConfig[];
}

// 路由守卫类型
export type NavigationGuard = (
  to: any,
  from: any,
  next: (to?: any) => void
) => void | Promise<void>;

class RouterManager {
  private guards: NavigationGuard[] = [];
  private routes: RouteConfig[] = [];

  // 添加路由守卫
  addGuard(guard: NavigationGuard) {
    this.guards.push(guard);
  }

  // 执行路由守卫
  async executeGuards(to: any, from: any): Promise<boolean> {
    for (const guard of this.guards) {
      await new Promise<void>((resolve, reject) => {
        guard(to, from, (to) => {
          if (to) {
            reject(new Error('Navigation redirected'));
          } else {
            resolve();
          }
        });
      });
    }
    return true;
  }

  // 设置路由配置
  setRoutes(routes: RouteConfig[]) {
    this.routes = routes;
  }

  // 获取路由配置
  getRoutes(): RouteConfig[] {
    return this.routes;
  }

  // 根据路径查找路由
  findRoute(path: string): RouteConfig | null {
    for (const route of this.routes) {
      if (route.path === path) {
        return route;
      }
      if (route.children) {
        const childRoute = route.children.find(child => child.path === path);
        if (childRoute) {
          return childRoute;
        }
      }
    }
    return null;
  }

  // 检查路由是否需要认证
  requiresAuth(path: string): boolean {
    const route = this.findRoute(path);
    return route?.meta?.requiresAuth || false;
  }

  // 获取路由标题
  getRouteTitle(path: string): string {
    const route = this.findRoute(path);
    return route?.meta?.title || '';
  }
}

// 创建路由管理器实例
export const routerManager = new RouterManager();

// 导出类型
export { RouterManager };
