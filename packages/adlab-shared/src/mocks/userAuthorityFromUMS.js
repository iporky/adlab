export const userAuthorityFromUMS = {
  clients: [
    {
      clientId: 'testclientone',
      clientDisplayName: 'Test Client One',
      accounts: [
        {
          accountId: 'testclientone',
          accountDisplayName: 'Test Client One',
          packageCode: 'custom',
          products: [
            {
              productId: 'personalization',
              roles: ['developer', 'admin'],
              components: [],
            },
          ],
        },
        {
          accountId: 'testclientTwo',
          accountDisplayName: 'Test Client Two',
          packageCode: 'custom',
          products: [
            {
              productId: 'personalization',
              roles: ['admin'],
              components: [],
            },
          ],
        },
      ],
    },
    {
      clientId: 'tfsai',
      clientDisplayName: '247 ai',
      accounts: [
        {
          accountId: 'tfsai',
          accountDisplayName: '247 ai',
          packageCode: 'custom',
          products: [
            {
              productId: 'personalization',
              roles: ['developer'],
              components: [],
            },
          ],
        },
      ],
    },
    {
      clientId: 'tfsinc',
      clientDisplayName: '247 inc',
      accounts: [
        {
          accountId: 'tfsinc',
          accountDisplayName: '247 inc',
          packageCode: 'custom',
          products: [
            {
              productId: 'personalization',
              roles: ['developer'],
              components: [],
            },
          ],
        },
      ],
    },
  ],
};
