export default defineAppConfig({
  ui: {
    colors: {
      primary: 'gold',
      neutral: 'sand',
    },
    modal: {
      slots: {
        overlay: 'bg-(--color-sand-950)/50 backdrop-blur-sm',
        content:
          'bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl sm:max-w-md w-[calc(100vw-2rem)]',
      },
    },
    card: {
      slots: {
        root: 'rounded-xl',
        header: 'p-5 pb-0',
        body: 'p-5',
        footer: 'p-5 pt-0',
      },
      defaultVariants: {
        variant: 'outline',
      },
    },
    input: {
      slots: {
        root: 'rounded-xl',
      },
      defaultVariants: {
        size: 'lg',
        variant: 'outline',
      },
    },
    inputMenu: {
      slots: {
        root: 'rounded-xl',
      },
      defaultVariants: {
        size: 'lg',
        variant: 'outline',
      },
    },
    alert: {
      slots: {
        root: 'rounded-xl',
      },
      defaultVariants: {
        variant: 'soft',
      },
    },
    formField: {
      slots: {
        label: 'text-sm font-semibold text-(--color-sand-700) dark:text-(--color-sand-200)',
      },
    },
  },
})
