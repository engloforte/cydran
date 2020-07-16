import Module from "@/module/Module";
import Type from "@/type/Type";
import ElementMediator from "@/element/ElementMediator";
import { ComponentConfig } from "@/component/ComponentConfig";
import Disposable from "@/pattern/Disposable";
import Nestable from "@/component/Nestable";
import Scope from "@/model/Scope";

interface StageBuilder {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): StageBuilder;

	withComponentBefore(id: string, moduleName?: string): StageBuilder;

	withComponentAfter(id: string, moduleName?: string): StageBuilder;

	withComponent(id: string): StageBuilder;

	withInitializer(callback: (stage?: Stage) => void): StageBuilder;

	withTraceLogging(): StageBuilder;

	withDebugLogging(): StageBuilder;

	withInfoLogging(): StageBuilder;

	withWarnLogging(): StageBuilder;

	withErrorLogging(): StageBuilder;

	withFatalLogging(): StageBuilder;

	withLoggingDisabled(): StageBuilder;

	withElementMediator(name: string, supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): StageBuilder;

	withConstant(id: string, instance: any): StageBuilder;

	withPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withPrototypeFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): StageBuilder;

	withSingletonFromFactory(id: string, factoryFn: () => any, dependencies?: string[]): StageBuilder;

	withImplicit(id: string, template: string, config?: ComponentConfig): StageBuilder;

	withCapability(capability: (builder: StageBuilder) => void): StageBuilder;

	withScopeItem(name: string, item: any): StageBuilder;

	withProperties(properties: any): StageBuilder;

	build(): Stage;

}

interface Stage extends Disposable {

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	get<T>(id: string): T;

	start(): Stage;

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>): void;

	registerSingleton(id: string, classInstance: Type<any>): void;

	getScope(): Scope;

	isStarted(): boolean;

}

export {
	Stage,
	StageBuilder
};