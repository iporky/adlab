export const userPermissions = {
  clients: {
    testclientone: {
      clientDisplayName: 'Test Client One',
      accounts: {
        testclientone: {
          accountDisplayName: 'Test Client One',
          permissions: [
            'datasource.create',
            'datasource.update',
            'datasource.read',
            'datasource.delete',
            'campaigns.create',
            'campaigns.update',
            'campaigns.read',
            'campaigns.publish',
            'campaigns.delete',
            'campaigns.pause',
          ],
        },
        testclientTwo: {
          accountDisplayName: 'Test Client Two',
          permissions: [
            'campaigns.create',
            'campaigns.update',
            'campaigns.read',
            'campaigns.publish',
            'campaigns.delete',
            'campaigns.pause',
          ],
        },
      },
    },
    tfsai: {
      clientDisplayName: '247 ai',
      accounts: {
        tfsai: {
          accountDisplayName: '247 ai',
          permissions: ['datasource.create', 'datasource.update', 'datasource.read', 'datasource.delete'],
        },
      },
    },
    tfsinc: {
      clientDisplayName: '247 inc',
      accounts: {
        tfsinc: {
          accountDisplayName: '247 inc',
          permissions: ['datasource.create', 'datasource.update', 'datasource.read', 'datasource.delete'],
        },
      },
    },
  },
};
