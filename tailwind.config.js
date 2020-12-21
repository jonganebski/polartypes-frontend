module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        myRed: {
          light: '#e14164',
          DEFAULT: '#de2b52',
          dark: '#b91d3f',
        },
        warningRed: {
          DEFAULT: '#de2b52',
        },
        myBlue: {
          DEFAULT: '#09c',
          dark: '#007399',
        },
        myGray: {
          lightest: '#f3f5f7',
          light: '#e7eaee',
          DEFAULT: '#b7c0cd',
          dark: '#8a99ad',
          darkest: '#4b5a6c',
        },
        myGreen: {
          dark: `rgba(0, 46, 61, 90)`,
          darkest: '#002e3d',
        },
      },
      fontFamily: {
        headFont: ['Lato', 'Montserrat', 'sans-serif'],
        bodyFont: ['Noto Serif', 'Georgia', 'serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
