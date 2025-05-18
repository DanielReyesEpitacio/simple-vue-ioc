import { App } from "vue";

export type DependencyFactory<T> = (context:IoC)=> T;

export type DependencyDefinition<T> = {identifier:string, factory:DependencyFactory<T>}

export interface IoC {
    register<T>(identifier:string, factory:DependencyFactory<T>):void;
    inject<T>(identifier:string):T|undefined;
    resolveAll():Map<string,any>

}

export class DefaultIoC implements IoC {

    private factories = new Map<string,DependencyFactory<unknown>>
    private dependencies = new Map<string,any>

    register<T>(identifier: string, factory: DependencyFactory<T>): void{
        if(this.dependencies.has(identifier)){
            return;
        }

        this.factories.set(identifier,factory);
    }
    inject<T>(identifier: string): T | undefined {
       if(this.dependencies.has(identifier)){
        return this.dependencies.get(identifier) as T;
       }

       const factoryFunction = this.factories.get(identifier);
       if(!factoryFunction){
        return undefined;
       }

       const dependency = factoryFunction(this);
       if(dependency !== undefined){
        this.dependencies.set(identifier,dependency);
       }

       return dependency as T;
    }
    resolveAll(): Map<string,any> {
        const dependencies = new Map<string,any>();

        this.factories.forEach((v,k)=>{
            const dependency = v(this);
            dependencies.set(k,dependency);
        });

        return dependencies;
    }

}

export function createIoC(dependencies:Array<DependencyDefinition<any>>,ioc:IoC=new DefaultIoC()){

    dependencies.forEach(dependencyDefinition=>{
        ioc.register(dependencyDefinition.identifier,dependencyDefinition.factory);
    });

    return {
        install(app:App,options?:any){
            ioc.resolveAll().forEach((v,k)=>{
                app.provide(k,v);
            });
        }
    }
}
