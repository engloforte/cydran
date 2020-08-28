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

	private localValue: {
		first: string;
	};

	private items: any[];

	constructor() {
		super(`<div><ul c:each="m().items" c:each:mode="generated"><template c:type="empty" c:value="m().localValue"><li>{{m().modelValue}}<br />{{v().first}}</li></template><template c:type="item"><div>text</div></template></ul></div>`);
		this.items = [];
		this.modelValue = "Some model value";
		this.localValue = {
			first: "Some Local Value"
		};

	}

	public update(): void {
		this.$apply(() => {
			this.modelValue = "Some other model value";
			this.localValue.first = "Updated Local Value";
		});
	}

}

test("v() or m() should be proxied for implicit component with a value", () => {
	document.body.innerHTML = '<div id="app"></div>';

	builder("#app")
		.withInitializer((stage: Stage) => {
			const childComponent: ChildComponent = new ChildComponent();
			const parentComponent: ParentComponent = new ParentComponent();
			parentComponent.setChild("body", childComponent);
			stage.setComponent(parentComponent);

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->Some model value<!--#--><br><!--#-->Some Local Value<!--#--></li></ul></div></div></div>`);

			parentComponent.update();
			childComponent.update();

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->Some other model value<!--#--><br><!--#-->Updated Local Value<!--#--></li></ul></div></div></div>`);
		})
		.build()
		.start();

});

