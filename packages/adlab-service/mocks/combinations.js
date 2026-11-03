export const combinationsData = {
  campaignId: '6502c6234567890abcdef130',
  combinations: [
    {
      key: 'product',
      mapping: {
        product: ['product1', 'product2'],
        heading: ['heading1', 'heading2 {intent.os|os}'],
        cta: ['cta1', 'cta2']
      },
      persona: [
        {
          dayoftheweek: ['sunday', 'friday'],
          os: ['android', 'ios']
        }
      ]
    },
    {
      key: 'heading',
      mapping: {
        heading: ['text1'],
        product: ['product1', 'product2'],
        cta: ['cta1', 'cta3']
      },
      persona: [
        {
          dayoftheweek: ['tuesday', 'monday'],
          os: ['android', 'ios']
        }
      ]
    }
  ]
};
