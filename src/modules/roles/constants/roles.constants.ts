// Available modules and actions for the permissions
export const AVAILABLE_MODULES = [
    'users',
    'roles',
    'workspaces',
    'invitations',
    'profiles',
    'settings',
    /* RAPIDA: AVAILABLE_MODULES */
] as const;

export const AVAILABLE_ACTIONS = [
    'findAll',
    'findOne',
    'create',
    'update',
    'delete'
] as const;

export type ModuleType = typeof AVAILABLE_MODULES[number];
export type ActionType = typeof AVAILABLE_ACTIONS[number];