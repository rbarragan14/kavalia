export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'BASEWEB APP'
  },
  {
    name: 'Usuarios',
    url: '/account',
    icon: 'icon-star',
    children: [
      {
        name: 'Usuarios',
        url: '/account/users',
        icon: 'icon-star'
      },
      {
        name: 'Roles',
        url: '/account/roles',
        icon: 'icon-star'
      },
      {
        name: 'Auditoría',
        url: '/account/auditlogs',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Configuración',
    url: '/config',
    icon: 'icon-star',
    children: [
      {
        name: 'Catálogos',
        url: '/config/catalogs',
        icon: 'icon-star'
      },
      {
        name: 'Parámetros',
        url: '/config/parameters',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Tareas',
    url: '/task',
    icon: 'icon-star',
    children: [
      {
        name: 'Programar Tareas',
        url: '/task/tasks',
        icon: 'icon-star'
      },
    ]
  },
  {
    name: 'Fórmulas',
    url: '/calc',
    icon: 'icon-star',
    children: [
      {
        name: 'Fórmulas',
        url: '/calc/formulas',
        icon: 'icon-star'
      }
    ]
  },
  {
    divider: true
  },
];
