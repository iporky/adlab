export const roleMappings = [
  {
    _id: '64cdfd829ebdf0001e3eabf1',
    ecRole: 'admin',
    applicationRole: 'campaign_admin',
    permissions: [
      'campaigns.create',
      'campaigns.update',
      'campaigns.read',
      'campaigns.publish',
      'campaigns.delete',
      'campaigns.pause',
    ],
  },
  {
    _id: '64cdfd829ebdf0001e3eabf2',
    ecRole: 'admin',
    applicationRole: 'creative_admin',
    permissions: ['creatives.create', 'creatives.update', 'creatives.read', 'creatives.delete'],
  },
  {
    _id: '64cdfd829ebdf0001e3eabf3',
    ecRole: 'developer',
    applicationRole: 'data_manager',
    permissions: ['datasource.create', 'datasource.update', 'datasource.read', 'datasource.delete'],
  },
];
