import globals from 'globals';
import js from '@eslint/js';

import stylisticJs from '@stylistic/eslint-plugin';

export default [
    {
    // ...

        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            '@stylistic/js/indent': ['error', 4],
            '@stylistic/js/linebreak-style': ['error', 'unix'],
            '@stylistic/js/quotes': ['error', 'single'],
            '@stylistic/js/semi': ['error', 'always'],
        },
    },
];