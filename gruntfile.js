module.exports = (grunt) => {
    const {
        loadNpmTasks: loadPlugin,
        registerTask,
        initConfig: setup,
        file: {read: readFile, readJSON}
    } = grunt;
    const { shuffle } = require("lodash"); 

    const icons = {
        linkedin: '<i class="block-gray__icon">i</i>',
        gmail: '<i class="block-gray__icon">E</i>',
        github: '<i class="block-gray__icon">V</i>',
        telegram: '<i class="block-gray__icon">D</i>',
    };
    

    setup({
        sass: {
            options: {
                implementation: require('node-sass'),
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    './css/styles.min.css': './scss/main.scss'
                }
            }
        },
        replace: {
            partials: {
                src: './index.tpl',
                dest: './index.html',
                replacements: [{
                    from: '<!-- summary.html -->',
                    to: () => {
                        const summaryFileContent = readFile('./partials/summary.html');
                        const dateDifference = (year) => new Date(new Date() - new Date(`01/01/${year}`)).getFullYear() - 1970;


                        return summaryFileContent.replace(/<\!--\s*expirience:\s*(\d{4})\s*-->/g, ([,], year) => dateDifference(year));
                    }
                }, {
                    from: '<!-- expertise.html -->',
                    to: () => {
                        const expertise = readJSON('./partials/expertise.json');

                        return shuffle(expertise).reduce((cumul, item) => {
                           return  cumul.concat(`
                            <li>${item}</li>
                           `);
                        }
                        , '');
                    }
                }, {
                    from: '<!-- education.html -->',
                    to: '<%= grunt.file.read("./partials/education.html") %>'
                }, {
                    from: '<!-- projects.html -->',
                    to: () => {
                        const projects = readJSON('./partials/projects.json');

                        return projects.reverse().reduce((cumul, {projectName, description, toolsNTech, teamLang, projectRole, duration, teamSize}) => {
                           return  cumul.concat(`
                            <tr>
                                <td>${projectName}</td><td>&#x25A0;</td><td>Project name</td>
                            </tr>
                            <tr>
                                <td>${description}</td><td>&#x25A0;</td><td>Description</td>
                            </tr>
                            <tr>
                               <td>${toolsNTech}</td><td>&#x25A0;</td><td>Tools and technologies used</td>
                            </tr>
                            <tr>
                               <td>${teamLang}</td><td>&#x25A0;</td><td>Team language</td>
                            </tr>
                            <tr>
                               <td>${projectRole}</td><td>&#x25A0;</td><td>Project role</td>
                            </tr>
                            <tr>
                               <td>${duration}</td><td>&#x25A0;</td><td>Project duration</td>
                            </tr>
                            <tr>
                               <td>${teamSize}</td><td>&#x25A0;</td><td>Team size</td>
                            </tr>
                           `);
                        }
                        , '');
                    }
                }, {
                    from: '<!-- photo.html -->',
                    to: '<%= grunt.file.read("./partials/photo.html") %>'
                }, {
                    from: '<!-- about.html -->',
                    to: '<%= grunt.file.read("./partials/about.html") %>'
                }, {
                    from: '<!-- contacts.html -->',
                    to: () => {
                        const contacts = readJSON('./partials/contacts.json');

                        return contacts.reduce((cumul, {href, text, icon}) => {
                           return  cumul.concat(`
                           <li>
                                <a class="block-gray__link" href="${href}">
                                    ${icons[icon]}
                                    ${text}
                                </a>
                            </li>
                           `);
                        }
                        , '');
                    }
                }, {
                    from: '<!-- languages.html -->',
                    to: '<%= grunt.file.read("./partials/languages.html") %>'
                }, {
                    from: '<!-- hobbies.html -->',
                    to: '<%= grunt.file.read("./partials/hobbies.html") %>'
                }, {
                    from: '<!-- name.html -->',
                    to: '<%= grunt.file.read("./partials/name.html") %>'
                }, {
                    from: '<!-- position.html -->',
                    to: '<%= grunt.file.read("./partials/position.html") %>'
                }
                ]
            }
        },
        watch: {
            sass: {
                files: ['./scss/main.scss', './scss/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['./partials/*.html', './index.tpl'],
                tasks: ['replace:partials'],
                options: {
                    livereload: true
                }
            },
            json: {
                files: ['./partials/*.json'],
                tasks: ['replace:partials'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    base: '.',
                    livereload: true
                }
            }
        }
    });

    loadPlugin('grunt-sass');
    loadPlugin('grunt-text-replace');
    loadPlugin('grunt-contrib-connect');
    loadPlugin('grunt-contrib-watch');

    registerTask('default', ['sass', 'replace:partials', 'connect', 'watch']);
};