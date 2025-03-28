/*
 * @Author: aFei
 * @Date: 2025-03-26 10:30:00
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-28 10:47:32
*/
const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('view/index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('view/index.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        top: 0,
        behavior: 'smooth'
      }
    }
  }
});
export default router;