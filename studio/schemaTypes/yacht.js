import {defineArrayMember, defineField, defineType} from 'sanity';

const altField = () => defineField({
  name: 'alt',
  title: 'Image description',
  type: 'string',
  description: 'Briefly describe the yacht and what is visible in this photo.',
  validation: rule => rule.required().max(200),
});

const countField = (name, title) => defineField({
  name,
  title,
  type: 'number',
  group: 'specifications',
  validation: rule => rule.required().integer().min(1),
});

export const yacht = defineType({
  name: 'yacht',
  title: 'Yacht',
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'specifications', title: 'Specifications'},
    {name: 'photos', title: 'Photos'},
    {name: 'website', title: 'Website'},
  ],
  initialValue: {
    active: true,
    featured: false,
    sortOrder: 100,
    type: 'Monohull',
    charterModes: ['Bareboat', 'Skippered'],
    bases: ['Lefkas', 'Athens'],
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Yacht name / model',
      type: 'string',
      group: 'details',
      validation: rule => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Page address',
      type: 'slug',
      group: 'details',
      description: 'Click Generate after entering the name. Keep this unchanged once the yacht page is live so existing links keep working.',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: input => input.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 96).replace(/-$/g, ''),
      },
      validation: rule => rule.required().custom(value => {
        if (!value?.current) return true;
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) && value.current.length <= 96
          ? true
          : 'Use lowercase letters, numbers, and single hyphens, up to 96 characters.';
      }),
    }),
    defineField({
      name: 'builder',
      title: 'Builder',
      type: 'string',
      group: 'details',
      validation: rule => rule.required().max(100),
    }),
    defineField({
      name: 'year',
      title: 'Build year',
      type: 'number',
      group: 'details',
      validation: rule => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: 'type',
      title: 'Yacht type',
      type: 'string',
      group: 'details',
      options: {list: ['Monohull', 'Catamaran'], layout: 'radio'},
      validation: rule => rule.required().custom(value => !value || ['Monohull', 'Catamaran'].includes(value) || 'Choose Monohull or Catamaran.'),
    }),
    defineField({
      name: 'tag',
      title: 'Short tagline',
      type: 'string',
      group: 'details',
      description: 'A short line displayed under the yacht name.',
      validation: rule => rule.required().max(160),
    }),
    defineField({
      name: 'blurb',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'details',
      validation: rule => rule.required().max(4000),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string', validation: rule => rule.required().max(200)})],
      validation: rule => rule.required().min(1).max(12).unique(),
    }),
    countField('cabins', 'Cabins'),
    countField('guests', 'Maximum guests'),
    countField('berths', 'Berths'),
    countField('heads', 'Heads / bathrooms'),
    defineField({
      name: 'charterModes',
      title: 'Charter options',
      type: 'array',
      group: 'specifications',
      of: [defineArrayMember({type: 'string', validation: rule => rule.required().custom(value => !value || ['Bareboat', 'Skippered'].includes(value) || 'Choose Bareboat or Skippered.')})],
      options: {list: ['Bareboat', 'Skippered']},
      validation: rule => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'bases',
      title: 'Departure bases',
      type: 'array',
      group: 'specifications',
      description: 'Add only the bases this yacht is available from.',
      of: [defineArrayMember({type: 'string', validation: rule => rule.required().max(100)})],
      validation: rule => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'specs',
      title: 'Additional specifications',
      type: 'array',
      group: 'specifications',
      description: 'Optional extra details such as length, beam, draft, or engine. Include units in the value.',
      of: [defineArrayMember({
        name: 'specification',
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string', validation: rule => rule.required().max(80)}),
          defineField({name: 'value', title: 'Value', type: 'string', validation: rule => rule.required().max(200)}),
        ],
        preview: {select: {title: 'label', subtitle: 'value'}},
      })],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main yacht photo',
      type: 'image',
      group: 'photos',
      description: 'Used on fleet cards, the homepage, and this yacht’s page. Use the hotspot tool to keep the yacht in frame.',
      options: {hotspot: true},
      fields: [altField()],
      validation: rule => rule.required().assetRequired(),
    }),
    defineField({
      name: 'gallery',
      title: 'Yacht photo gallery',
      type: 'array',
      group: 'photos',
      description: 'Optional additional photos for this yacht’s page. Drag to change their order.',
      of: [defineArrayMember({
        type: 'image',
        options: {hotspot: true},
        fields: [altField()],
        validation: rule => rule.required().assetRequired(),
      })],
    }),
    defineField({
      name: 'active',
      title: 'Show on website',
      type: 'boolean',
      group: 'website',
      description: 'Turn off and publish to remove this yacht from the website on the next website build. You can keep its record and photos here.',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      group: 'website',
      description: 'Show this active yacht in the homepage fleet selection.',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Display order',
      type: 'number',
      group: 'website',
      description: 'Lower numbers appear first. Yachts with the same number are sorted by name.',
      validation: rule => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {title: 'Website order', name: 'websiteOrder', by: [{field: 'sortOrder', direction: 'asc'}, {field: 'name', direction: 'asc'}]},
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', year: 'year', type: 'type', active: 'active', media: 'mainImage'},
    prepare({title, year, type, active, media}) {
      return {title, subtitle: [type, year, active === false ? 'Hidden from website' : null].filter(Boolean).join(' · '), media};
    },
  },
});
