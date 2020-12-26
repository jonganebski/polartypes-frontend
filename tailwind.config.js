const commonHeaderH = '3.5rem';
const tripHeaderH = '3rem';

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
          light: '#0bc',
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
      margin: {
        homepageCover: '90vh',
      },
      height: {
        homepageCover: '90vh',
        commonHeader: commonHeaderH,
        tripHeader: tripHeaderH,
        tripBody: `calc(100vh - ${commonHeaderH} - ${tripHeaderH})`,
        screenExceptHeader: `calc(100vh - ${commonHeaderH})`,
      },
      width: {
        p90: '90%',
      },
      maxHeight: {
        screen70: '70vh',
        screen80: '80vh',
        screen90: '90vh',
      },
      minWidth: {
        px600: `600px`,
      },
      padding: {
        imageRatio: '66.67%',
        p90: '90%',
        square: '100%',
      },
      gridTemplateColumns: {
        tripsPage: '400px auto',
        oneToTwo: '1fr 2fr',
        uploadBox: '10px 1fr 10px 1fr 10px 1fr 10px 1fr 10px',
      },
      boxShadow: {
        surround: '0 2px 8px 0 rgba(0,0,0,0.12)',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      translate: ['group-hover'],
    },
  },
  plugins: [],
};
