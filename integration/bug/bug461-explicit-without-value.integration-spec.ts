import { builder, Component } from 'cydran';

class ParentComponent extends Component {

	private value: {
		first: string;
	};

	constructor() {
		super(`<div><script type="cydran/region" c:name="body" c:value="m().value"></script></div>`);
		this.value = {
			first: "Some Value"
		};
	}

	public update(): void {
		this.$apply(() => {
			this.value.first = "Some other value";
		});
	}

}

class ChildComponent extends Component {

	private modelValue: string;

	private items: any[];

	constructor() {
		super(`<div><ul c:each="m().items" c:each:mode="generated"><template c:type="empty" c:component="emptyChild"></ul></div>`);
		this.items = [];
		this.modelValue = "Some model value";
	}

	public update(): void {
		this.$apply(() => {
			this.modelValue = "Some other model value";
		});
	}

}

class EmptyComponent extends Component {

	private localValue: string;

	constructor() {
		super(`<li>{{m().localValue}}<br />{{v().first}}</li>`);
		this.localValue = "A Local Value";
	}

}

test("v() or m() should be proxied for explicit component without a value", () => {
	document.body.innerHTML = '<div id="app"></div>';

	builder("#app")
		.withPrototype("emptyChild", EmptyComponent)
		.withInitializer((stage: Stage) => {
			const childComponent: ChildComponent = new ChildComponent();
			const parentComponent: ParentComponent = new ParentComponent();
			parentComponent.setChild("body", childComponent);
			stage.setComponent(parentComponent);

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->A Local Value<!--#--><br><!--#-->Some Value<!--#--></li></ul></div></div></div>`);

			parentComponent.update();
			childComponent.update();

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->A Local Value<!--#--><br><!--#-->Some other value<!--#--></li></ul></div></div></div>`);
		})
		.build()
		.start();

});
