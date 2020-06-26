module.exports = {
    purge: [
        './components/**/*.tsx',
        './pages/**/*.tsx'
    ],
    theme: {
        extend: {},
        fontFamily: {
            'heading': ['Muli', 'sans-serif'],
            'sans': ['Roboto', 'sans-serif']
        },
        colors: {
            transparent: 'transparent',
            black: '#000',
            white: '#fff',
            red: {
                400: '#f2380f',
                700: '#df424e'
            },
            blue: {
                400: '#7ed1f2',
                700: '#3999bf'
            },
            gray: {
                400: '#d7d7d9',
                700: '#87878c'
            }
        }
    },
    variants: {},
    plugins: [],
}