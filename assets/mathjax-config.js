window.MathJax = {
    loader: {
        load: ['[tex]/tagformat'],
    },
    tex: {
        inlineMath: [              // start/end delimiter pairs for in-line math
            ['$', '$'],
            ['\\(', '\\)']
        ],
        displayMath: [             // start/end delimiter pairs for display math
            ['$$', '$$'],
            ['\\[', '\\]']
        ],
        packages: { '[+]': ['tagformat'] },
        macros: {
            RR: '{\\bf R}',
            bold: ['{\\bf #1}', 1]
        },
        tags: 'ams',
    }
};