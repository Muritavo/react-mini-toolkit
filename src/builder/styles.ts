export default class StylesBuilder {
    type?: NonNullable<FeatureData['styles']>['model'];
    componentName!: string;
    enabled!: boolean;

    withComponentName(componentName: string) {
        this.componentName = componentName
        return this;
    }

    withType(type?: typeof this.type) {
        this.type = type
        return this;
    }

    withFeatureEnabled(enabled: boolean) {
        this.enabled = enabled;

        return this;
    }

    build(): {
        import: () => string | undefined,
        componentBody: () => string | undefined
    } {
        const _definedType = this.enabled ? this.type : undefined;
        return {
            import: () => {
                switch (_definedType) {
                    case "mui":
                        return `import use${this.componentName}Styles from './${this.componentName}.styles'`;
                    case "scss":
                        return `import Styles from './${this.componentName}.module.scss';`
                    case undefined:
                        return undefined;
                }
            },
            componentBody: () => {
                switch (_definedType) {
                    case "mui":
                        return `      const classes = use${this.componentName}Styles()`;
                    case "scss":
                    case undefined:
                        return undefined
                }
            }
        }
    }
}