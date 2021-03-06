const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts)
    {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts)

        // Next, add your custom code
        this.option('babel') // This method adds support for a `--babel` flag
    }

    prompting()
    {
        return this.prompt([
                {
                    type   : 'input',
                    name   : 'name',
                    message: 'Your plugin name (UpperCamelCase)',
                    default: this.appname,
                    validate: this._validatePluginName
                },
                {
                    type   : 'input',
                    name   : 'author',
                    message: 'The plugin author'
                },
                {
                    type   : 'input',
                    name   : 'license',
                    message: 'The plugin license',
                    default: 'MIT'
                },
                {
                    type   : 'input',
                    name   : 'shortDescription',
                    message: 'Your plugin short description (DE)'
                },
                {
                    type   : 'input',
                    name   : 'price',
                    message: 'The price of your plugin',
                    default: 0.00
                },
                {
                    type   : 'input',
                    name   : 'version',
                    message: 'Your plugin version',
                    default: '0.0.1'
                },
                {
                    type   : 'checkbox',
                    name   : 'categories',
                    message: 'The plugin category',
                    choices: [
                        {value: '3523', name: 'Markets'},
                        {value: '3518', name: 'Themes'},
                        {value: '3517', name: 'Templates'},
                        {value: '3527', name: 'Widgets'},
                        {value: '3519', name: 'Payment'},
                        {value: '3521', name: 'Integration'}
                    ]
                },
                {
                    type   : 'list',
                    name   : 'type',
                    message: 'The plugin type',
                    choices: [
                        'general',
                        'template',
                        'theme',
                        'shipping',
                        'payment'
                    ],
                    default: 'general',
                    store  : true
                }
            ]).then((answers) => {
                this.config.set("answers", answers)
    })
        ;
    }

    writing()
    {

        let answers = this.config.get("answers")

        this.fs.copyTpl(
            this.templatePath('plugin.json'),
            this.destinationPath('plugin.json'),
            {
                answers: answers
            }
        )

        this.fs.copyTpl(
            this.templatePath('config.json'),
            this.destinationPath('config.json')
        )

        this._copyPhpFiles(answers)
        this._copyMetaFiles(answers)
        this._copyTwigFiles(answers)
    }

    _copyPhpFiles(answers)
    {
        this.fs.copyTpl(
            this.templatePath('src/Providers/ServiceProvider.php'),
            this.destinationPath('src/Providers/' + answers.name + 'ServiceProvider.php'),
            {name: answers.name}
        )

        this.fs.copyTpl(
            this.templatePath('src/Providers/RouteServiceProvider.php'),
            this.destinationPath('src/Providers/' + answers.name + 'RouteServiceProvider.php'),
            {name: answers.name}
        )

        this.fs.copyTpl(
            this.templatePath('src/Controllers/Controller.php'),
            this.destinationPath('src/Controllers/' + answers.name + 'Controller.php'),
            {name: answers.name}
        )
    }

    _copyMetaFiles(answers)
    {
        this.fs.copyTpl(
            this.templatePath('meta'),
            this.destinationPath('meta'),
            {name: answers.name, version: answers.version}
        )
    }

    _copyTwigFiles(answers)
    {
        this.fs.copyTpl(
            this.templatePath('resources/views/Index.twig'),
            this.destinationPath('resources/views/Index.twig'),
            {name: answers.name}
        )
    }

    _validatePluginName(input)
    {
        const regex = /[A-Z][a-zA-Z0-9]+/;
            
        if(input.match(regex))
        {
            return true;
        }
        else
        {
            return "Invalid plugin name. Please use alphanumeric characters in UpperCamelCase only."
        }
    }
}