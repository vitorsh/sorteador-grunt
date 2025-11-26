module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: {
                options: {
                    compress: true
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.js'
                        }
                    ],
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['src/index.html'], dest: 'dev/'}
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ],
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['prebuild/index.html'], dest: 'dist/'}
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },
        copy: {
            dev: {
                files: [
                    {expand: true, flatten: true, src: ['src/scripts/main.js'], dest: 'dev/scripts/'}
                ]
            },
            dist: {
                files: [
                    {expand: true, flatten: true, src: ['src/scripts/main.js'], dest: 'dist/scripts/'}
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/scripts/main.min.js': ['src/scripts/main.js']
                }
            }
        },
        watch: {
            styles: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development', 'replace:dev', 'copy:dev']
            },
            scripts: {
                files: ['src/scripts/**/*.js'],
                tasks: ['copy:dev', 'copy:dist', 'uglify']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['htmlmin:dist', 'replace:dist', 'copy:dist']
            }
        },
        clean: ['prebuild']
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['less:development', 'replace:dev', 'copy:dev']);
    grunt.registerTask('build', ['clean', 'less:production', 'htmlmin:dist', 'replace:dist', 'copy:dist', 'uglify']);
};