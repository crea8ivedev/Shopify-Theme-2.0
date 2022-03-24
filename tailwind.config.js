const typography = require("@tailwindcss/typography");
const plugin = require("tailwindcss/plugin");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
  theme: {
    mode: 'jit',
    // Overrides
    container: {
      center: true,
    },
    // Extend
    extend: {
      fontFamily: {
        sans: ["quincycf-text", "Helvetica", "Arial"],
        "sans-serif": ["quincycf-text", "Helvetica", "Arial"],
        header: ['"Roboto Mono"', "Helvetica", "Arial"],
      },
      colors: {
        cream: {
          500: "#F7F3ED",
        },
        red: {
          500: "#D23425",
        },
        green: {
          500: "#3E4B20",
        },
        rose: {
          500: "#E28D8F",
        },
        current: "currentcolor",
      },
      fontSize: {
        "40px": "40px",
        "28px": "28px",
        "18px": "18px",
        "20px": "20px",
        "15px": "15px",
        "10px": "10px",
        "13px": "13px",
        "17px": "17px",
        "22px": "22px",
      },
      margin: {
        "0px": "0px",
        "10px": "10px",
        "15px": "15px",
        "20px": "20px",
        "30px": "30px",
        "40px": "40px",
        "-200px": "-200px",
      },
      lineHeight: {
        1.1: "1.1",
        1.2: "1.2",
        1.3: "1.3",
        1.4: "1.4",
      },
      width: {
        "60px": "60px",
        "40px": "40px",
        "30px": "30px",
        "180px": "180px",
        "25px": "25px",
        "220px": "220px",
        "98px": "98px",
      },
      height: {
        "60px": "60px",
        "40px": "40px",
        "30px": "30px",
        "25px": "25px",
      },
      flex: {
        1: "1 1 0%",
        auto: "1 1 auto",
        initial: "0 1 auto",
        inherit: "inherit",
        none: "none",
        2: "2 2 0%",
      },
      inset: {
        "0px": "0px",
        "-100px": "-100px",
      },
    },
  },
  purge: {
    content: ["./theme/**/*.liquid", "./src/**/*.svelte"],
    safelist: [
      /.+px/, // safelist all classes in extension file
    ],
  },
  corePlugins: {},
  plugins: [
    typography(),
    plugin(({ addBase, theme }) => {
      addBase({
        body: { fontFamily: '"quincycf-text", Helvetica, Arial' },
      });
    }),
    aspectRatio,
  ],
};
