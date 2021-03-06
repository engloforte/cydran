# <a id="entrytitle">[Cydran](https://github.com/cydran/cydran)</a>
An unobtrusive Javascript presentation framework.

## Concepts
Code examples in this documentation are based in <a href="https://www.typescriptlang.org" target="_new">Typescript</a> (a typed superset of JavaScript that compiles to plain JavaScript), but are equally demostrable in <a href="https://en.wikipedia.org/wiki/ECMAScript#5th_Edition" target="_new">ES5</a> or any other current version of Javascript.  Furthermore, terminology common to web development, such as DOM (document object model) is included and assumed understood.  Such term definitions not explictly defined are easility available from many internet sources.

* <a id="concept-pubsub"></a>***``PubSub``*** - scoped ([stage](#concept-stage), [module](#concept-module), [component](#concept-component)) inter-process publication/subscription communication channels as well as objects external to Cydran.  References to the PubSub object are singleton/static in nature. PubSub is always accessible by default in Cydran [components - (see the constructor)](#concept-component-ex1).  Explicit access to PubSub is allowed to 3rd party/external scripts facilitating integration needs and scenarios. Management of the PubSub resource requires non Cydran components/participants to know how to clean up after themselves to remove any static references that may have been created through PubSub.enableGlobal() and PubSub.disableGlobal() method calls.  Examples of use include:
<a id="concept-pubsub-msg-ex1"></a>

		// listening for direct messages
		this.on("messageType").invoke(expression);
		// listening for broadcast messages
		this.on("messageType").forChannel("channelName").invoke(expression);

		// publish a message directly
		this.message("channelName", "messageType", somePayLoad);
		// broadcast a message
		this.broadcast("channelName", "messageType", somePayLoad);
		// broadcast a message in the Cydran global scope
		this.broadcastGlobally("channelName", "messageType", somePayLoad);

* <a id="concept-stage"></a>***``Stage``*** - a Cydran area of work/influence identified by a CSS selector expression within the DOM. Content on the ``stage`` is determined by Cydran [components](#concept-component).  See ``this.setComponent(new CydranComponent()`` below.  A Cydran stage is created through the builder pattern using a static instance reference of the StageBuilder.

		import { builder, Stage } from "cydran";

		builder("body")
			.withDebugLogging()
			.withSingleton("someSvc", SomeSvc)
			.withScopeItem("globalFn", (key?: string) => {})
			.withCapability(describedCapability)
			.withInitializer((stage: Stage) => {
				// this.setComponent(new HomeView());
				stage.setComponentFromRegistry("pg:home");
				const router: Router = stage.get("router");
				router.start();
			})
			.build()
			.start();

* <a id="concept-module"></a>***``Module``*** - a grouping of related objects/code providing "black box" boundary use in the provision and use of services and [components](#concept-component) within Cydran.  A Cydran module is defined as follows:

		const module: Module = builder.getModule("<namespace>");
		module.registerPrototype("<svc_identifier>", SomeObjOrRef);
		module.associate(SomeObjOrRef);
* <a id="concept-component"></a>***``Component``*** - Cydran components are intended to be declarative, non-conflicting units of UI/UX functionality that will ***NOT*** produce any unintended side-effects; a functionally practical "black box". Components are default participatory members of the Cydran [PubSub](#concept-pubsub) framework and inherit the same [method signatures](#concept-pubsub-msg-ex1) by default.

	<a id="concept-component-ex1"></a>

		const TEMPLATE = "<div>... markup here ...</div>";
		class App extends Cydran.Component {

			private count: number = 0;

			constructor() {
				super(TEMPLATE);
				this.on("msgType").forChannel("name").invoke(this.someMethod);
				this.count = 0;
				this.msg = "";
			}

			someMethod() {
				this.count++;
			}
		}

* <a id="concept-scope"></a>***``Scope``*** - Registered objects become available for evaluation/utilization within the local scope of the processing function.  Cydran ``scope`` is found or defined in three (3) locations oraganized by structural heiarchy:
	* ``stage``: the root scope of all scoped contexts and behaves as a global scope for the specified instance of Cydran. ``module`` scopes inherit from this context.

	* ``module``: a child of ``stage`` scope. All objects defined in ``stage`` scope are available in ``module`` because of inheritance. A new object in this scope with the same id/signature as defined in inherited contexts only overrides the named object within the immediate specific realm or context of this ``module``. The ``stage`` references to the the object signature and any external accessor remain without impact beyond the immediate realm of activity. ``component`` scopes inherit from this context including overridden object references.

	* ``component``: a child of ``module.`` All objects defined in both  ``stage`` and ``module`` scopes are available here because of inheritance.  As with the ``module`` context, a new object in this scope with the same id/signature as defined in inherited contexts only overrides the named object within the imediate specific realm or context of this component. The ``stage`` and ``module`` references to the the object signature and any external accessor remain without impact beyond the immediate realm of activity.

	Typical scoped object registration in Cydran occurs during instantiation of any particual scope context but may also occur at any point thereafter.  Stage scope registration may appear as follows:

		builder("body")
			// logging
			.withDebugLogging()
			// global scope definition
			.withScopeItem("upper", (str: string) => str.toUpperCase())
			.withScopeItem("lower", (str: string) => str.toLowerCase())
			// additional work here
			.withInitializer((stage: Stage) => {
				stage.getScope().add("key", obj);
			})
			.build()
			.start();

			-- OR within a component --

			this.scope().add("somekey", (var1: any) => {
				const abc = var1;
				return abc;
			});

	Registration of objects in the ``stage`` scope may also happen with the definition of capability:

		function scopeItemCapability(builder: StageBuilder) {
			builder
				.withScopeItem("upper", (str: string) => str.toUpperCase())
				.withScopeItem("lower", (str: string) => str.toLowerCase());
		}

		-- then --

		builder("body")
			// logging
			.withDebugLogging()
			// capability reference
			.withCapability(scopeItemCapability)
			// more yada yada yada
			.build()
			.start();

	Scoped utility occurs within a Cydran [component template](#concept-markup).  The following example uses the reference immediately above regarding the "upper" and "lower" objects established in the ``stage`` scope.

			// within model
			this.attributeX == "abc";
			// within template
			{{ upper(m().attributeX) }} == ABC

			-- or --

			// within repeat item or value
			obj.attributeY == "ABcDE";
			// within template
			[[ lower(v().attributeY) ]] == abcde

* <a id="concept-model"></a>***``Model``*** - A programatic representation of a Cydran [component](#concept-component).  Access to the [model](#exp-model) is granted through [template markup](#concept-markup), fully qualified/valid [expressions](#exp), and by the ``this`` keyword in a [programmatic](#concept-component-ex1) context.
* <a id="concept-mvvm"></a>***[``Mvvm``](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)*** - abstracted base model functional implementation for Cydran.  Mvvm instances are assigned to each [binding representation ](#concept-markup)in Cydran templates.  No direct/programatic access is allowed.
* <a id="concept-elemmed"></a>***``ElementMediator``*** - functionality used by [Mvvm](#concept-mvvm) to reflect desired changes in the DOM.  Element mediators are the means of behavioral encapsulation and extension without alteration of the framework internals. An example might be to include markdown as part of a [component](#concept-component).
* <a id="concept-modmed"></a>***``ModelMediator``*** - functionality used by [Mvvm](#concept-mvvm) to reflect desired changes in the [model](#concept-model) of the Cydran [component](#concept-component)
* <a id="concept-digest"></a>***``Digest``*** - process by which both the [ModelMediators](#concept-modmed) and [ElementMediators](#concept-elemed) synchronize the correct specified objects and/or values with each other to be refelcted in the [UI/UX](#concept-markup) of the application.  Digests occur as specific Cydran lifecycle events and methods are invoked.  A digest cycle can be invoked deliberately from a Cydran component, but should only be done with care and understanding of the ramifcations.

		// Inside of a cydran component
		public someMethod() {
			// no-arg call
			//   - anonymous function, and empty array will be supplied automatically.
			this.$apply();
			// or
			// @param: Function -
			// @param: Array<any> - arguments
			this.$apply(() => {}, []);
		}

* <a id="concept-events"></a>***``Events``*** - [Template](#concept-markup) [events](#exp-on) are defined by the standard Javascrpt events supported in the browser/client of choice. There exist also Cydran [lifecycle](#lifecycle) events used in the development of custom Cydran based [components](#concept-component) or [element mediators](#concept-elemmed). If access to the raw JS event is required, it may be explicitly passed in an expression reference as [``$event``](#concept-reserved).  The method/function on the model would have to account for the event as an argument to make it accessible to the function.

		<!-- template -->
		pfx:onclick="m().doWork($event)"

		// model
		function doWork(evt) { ... };
* <a id="concept-env-props"></a>***``injectable/overridable properties``*** - potential externally sourced or provided property representations of either default and/or custom representations of Cydran/component state.

		builder(<css_selector_string: string>)
			.withDebugLogging() // or other level selection
			.withProperties({
				"cydran.production.enabled": true,
				"custom.property": "xyz"
			})
			.withPrototype(<component_id: string>, <instance: Object>, ["$param('custom.property')"])
			.withInitializer(stage: Stage => {
				stage.setComponent(<instance: Component>);
				// or
				stage.setComponentFromRegistry(<component_id: string>)
			})
			.build()
			.start();

	Current list of reserved properties in the Cydran ecosystem:
	* "cydran.digest.maxEvaluations": 10000,
	* "cydran.clone.maxEvaluations": 50,
	* "cydran.equals.maxEvaluations": 50,
	* "cydran.production.enabled": false,
	* "cydran.logging.trace.fullstack.color": "#00752d",
	* "cydran.logging.trace.color": "#ff9400",
	* "cydran.logging.debug.color": "#00752d",
	* "cydran.logging.info.color": "#2d57ca",
	* "cydran.logging.warn.color": "#ff9400"


* <a id="concept-markup"></a>***``templates``*** are the visual representation of a Cydran [component](#concept-component).  Templates must be represented as strings containing valid HTML, including cydran [tags](#concept-tags) and [expression](#exp) declarations, at the time of component instantiation with a single restriction that the template representation have one (1) root node/element.  Comment nodes will be ignored.  Cydran HTML component representations can even be nested within a Cydran [repeat structure](#exp-each), but must conform to the same rule of one (1) root node per defined template with comments being ignored.

		<!-- some_template1.html -->
		<div>
			<!-- other markup here -->
		</div>

	or

		<!-- some_template2.html -->
		<html>
			<body>
				<!-- other markup here -->
				<script pfx:component="zyx"></script>
			</body>

			<template id="something">
				<div>more markup here</div>
			</template>
		</html>

	or

		<!-- some_template3.html -->
		<div>
			<!-- other markup here -->
			<div pfx:each="m().list" pfx:each:mode="generated">
				<template pfx:type="item" pfx:component="zyx">
					<!-- content NOT allowed in this context -->
				</template>
			</div>

			<!-- and more markup here -->
			<div pfx:each="m().list" pfx:each:mode="auto">
				<template pfx:type="item">
					<!-- comment nodes allowed -->
					<span>{{v()}}</span>
				</template>
			</div>
		</div>

	It is the responsiblity of the developer to retrieve and provide the string representation of the template unless directly represented in a pfx:each scenario:

		// Template Access Methodologies
		* const TEMPLATE = document.querySelector("template[id=name]").innerHTML;
		* const TEMPLATE = "<div>[more markup here]</div>";
		* const TEMPLATE = doJavascriptCallThatReturnsString();
	***<span style="color: red;">When referencing a component as the root element in a Cydran pfx:each context, the finished markup of the represented component <span style="text-decoration: underline; color: black;">MUST</span> conform to the supported markup grammar of the target browser or device or there may be adverse behaviors. </span>***
	See <a href="https://www.w3.org/TR/html52/syntax.html#foster-parenting" target="_new">documentation</a> on the specifics of why/when this "foster parenting" occurs.

		<!-- component template representation -->
		<template id="some_unit">
			<div>some stuff</div>
		</template>

		<!-- use of component -->
		<table pfx:each="m().some_list" pfx:each:mode="generated">
			<template pfx:type="item" pfx:component="some_unit"></template>
		</table>

		<!-- result -->
		<!-- div tags gets relocated here -->
		<div>some stuff</div>
		<table>
			<!-- div tags not allowed here -->		</table>

* <a id="concept-reserved"></a>***``reserved words``*** - limited, but specific in nature and function.  There are technically only three (3) reserved words used in a cydran context but extends to five (5) if including a method call on the Cydran Component interface contract and the event variable reference:

	* ``$apply()`` - Similar in name to the Javascript ``Object`` type and ``apply`` method. Notwithstanding, special consideration is provided to the requirements of the Cydran [lifecycle](#lifecycle). This is for use in more advanced scenarios of custom component or mediator development.

			// inside a Cydran component method
			// this.$apply(fn: Function, []: any);
			this.$apply(() => { }, []);

	* ``$dispose()`` - Method signature indicating to Cydran that additional clean up is to occur before disposal of Component or plain JS object previously registered with Cydran.

	* ``$event`` - Reference to the raw Javascript event invoked within the context of any cydran [on[event]](#concept-events) context.

			<button c:onclick="m().someMethod($event)">

	* ``$index`` - Reference to the index position in a predicate for filtering and pagination in a repeated cydran structure.

			.withPredicate("$index >= p(0)
			&& $index < p(1)", "m().value0", "m().value1")

	* ``$prop`` - Environment parameter injection

			.withPrototype("key", <Object>, ["$prop:key_value"]).  The associated class will need to allow/account for a constructor argument to utilize the injected value.

	* ``$stage`` - Reserved key name to the Stage reference of the Cydran instance.  Also referenced in the Ids object of Cydran.

			const stage:Stage = this.get<Stage>("$stage");
			-- or --
			import { Ids } from "cydran";
			const stage:Stage = this.get<Stage>(Ids.STAGE);


## <a id="concept-prefix"></a>[Prefix](#concept-markup)
#### *The default namespace declaration in Cydran based HTML templates is "c:".*

This may be overridden through the use of ``ComponentConfig.withPrefix(prefix: string)`` but is not recommended without a full understanding of the ramifications and side-effects of doing so.  This documentation will <span style="color: red;">***NOT***</span> detail those particular issues.  Documentation references will show ``pfx:`` in examples with an implied and clear reference to the internal default Cydran prefix declaration.

All Cydran attribute uses are referrant to the declared namespace of the originating component; defaulting to the originating Cydran internal namespace, unless explicitly specified otherwise.  Third party and unofficial components may use the default namespace as long as all component identifiers are unique and distinctive from reserved names and identifiers within Cydran.  <span style="color: red;">***Attempting to use a Cydran reserved identifier for 3rd party components will result in an Error produced within Cydran while logged to the console, and the registration and use of the component disallowed.***</span> It is important to note that reserved identifiers are, by design and intent, uncomomn in their formulation and should not present any difficulty to 3rd party developers in their respective coding activities.

## <a id="concept-tags">[Cydran HTML Tags](#concept-markup)</a>
There is only one (1) markup/html tag that Cyran has any particular interest in aside from normal DOM operations of the browser.

* <a id="#tag-script"></a>``<script>`` <a href="https://www.w3.org/TR/html52/semantics-scripting.html#element-attrdef-script-type" target="_new">" ...allow(s) authors to add interactivity to their documents" with a special emphasis on the ``type`` </a>attribute to indicate the provenance and purpose of the specified functionality.  The specific attribute value understood and used by Cydran is ``cydran/region`` .

		<script type="cydran/region" ></script>

	Setting the ``type`` attribute to a specific value other than known and registered mime-types "means that the script is a data block, which is not processed. None of the script attributes (except type itself) have any effect on data blocks".
		<script pfx:type="cydran/region" ...></script>

	While data block attributes are stated as 'ignored' by the standard, additonal meaningful atttributes on the ``<script>`` tag with a ``cydran/region`` type have significance for Cydran:

	* ``pfx:name`` - indicates a declared and known mutable/changable region of the DOM within the scope and control of the Cydran framework
	* ``pfx:component`` - key value of a registered Cydran component to be injected as the functional representation of the visual representation of the model
	* ``pfx:value`` - model value reference assigned for use in the declared region/component space for consumption by the component
	* ``pfx:module`` - module to which the region is part of
	* ``pfx:lock`` - indicate whether the component is replaceable.

	The ``pfx:name`` or ``pfx:component`` attribute are requred but are NOT mutually exclusive in their use. The ``pfx:value`` attribute is optional but may be needed for proper data binding within the Cydran context.  If not supplied, the ``pfx:module`` is implied to be the default module.

* ``<template>`` <a href="https://www.w3.org/TR/html52/semantics-scripting.html#the-template-element" target="_new"> "...used to declare fragments of HTML that can be cloned and inserted in the document by script."</a> Utilization within Cydran is to provide for visual representation of a Cydran component within two specific scenarios.
	* Isolated template for use in a named component
	* Inline representation of a Cydran ``pfx:each`` item representation with an anonymous component OR bookmark for a named component in the same place.

			<template id="template_name/id">
				<div>
					<!-- additional nodes -->
				</div>
			</template>

		See the Cydran [pfx:each section](#exp-each) for more info.

## <a id="concept-attribute">[Cydran HTML Attributes](#concept-markup)</a>
All Cydran attribute values are evaluated as expression of work in a "truthy" context of the attribute value.  The are provided to describe additional functionality for the Cydran component.  The attributes stipulated in this document are "core" and part of Cydran.  There exist 4 primary types of attributes:

* invokable statement

		// code in compnent
		public doWork() { ... }

		// code in markup
		<input type="button" c:onclick="m().doWork()"/>

* read/eval only expression

		// code in component
		private readonly xyz = "Z";

		// expression in markup
		[[ m().xyz ]]

* string literal

		// code in markup
		<div c:if="m().wkval == 'some_string_value'"></div>

* assignable expression
		// code in component
		this.modelAttributeName: string = "XYZ";

		// code in markup
		<input type="text" pfx:model="m().modelAttributeName">

Additional custom behavior and functionality can be defined through the development and use of custom [model](#concept-elemmed) and [element](#concept-modmed) mediators.

* <a id="exp-custom"></a>***``pfx:[custom]``*** - use of custom [ElementMediator](#concept-elemmed) functionality is availble by extending the Cydran ElementMediator.

		<div pfx:markdown="m().mdvalue"></div>

* <a id="exp-on"></a>***``pfx:on[event]``*** - support of any/all event types is determined by the hardware and browser of the runtime platform. Access to the [raw Javascript event](#concept-reserved) is available through explicit argument or reference.

		<input type="text" pfx:onblur="m().doWork()" value="{{m().variable}}"></input>
		<!-- or -->
		<a pfx:onclick="m().doWork($event)">Some Link</a>

* <a id="exp-id"></a>***``pfx:id``*** - creates a programatic reference to the HTML element the attribute is attached to in a component scoped map for later use inside component logic to help avoid messy or expensive DOM traversals later in the component [lifecycle](#lifecycle).

		<input type="text" pfx::model="{{m().address.lastName}}" pfx:id="lastName" />

	Accessible in the component logic as:

		public focusLastName(): void {
			this.forElement("lastName").focus();
    	}

* <a id="exp-checked"></a>***``pfx:checked``*** - Will the form element (usually radio or checkbox) express a checked status

		<input type="checkbox"
			pfx:checked="!m().lineEditable"
			pfx:onchange="m().toggleLineEditable()" />

* <a id="exp-class"></a>***``pfx:class``*** - The named class (ie. populated) will be added to the HTML "class" attribute if the expression (ie. m().items.length > 0) evaluates "truthy"

		<ul pfx:class="{populated: m().items.length > 0}"></ul>

* <a id="exp-class"></a>***``pfx:enabled``*** - HTML "enabled" boolean attribute added or removed based on expression evaluation

		<button pfx:onclick="m().load()" pfx:enabled="!m().loading">Run</button>
* <a id="exp-class"></a>***``pfx:readonly``*** -

		<input type="text"
			pfx:readonly="!m().lineEditable"
			pfx:model="m().address.postalCode" />
* <a id="exp-style"></a>***``pfx:style``*** - CSS style as expressed in evaluated expression inserted into local HTML "style" attribute.

		<div class="container column"
			pfx:style="{border: '1px solid', borderColor: m().color}"></div>
* <a id="exp-forcefocus"></a>***``pfx:force-focus``*** - force focus on a specific DOM element.

		<input type="text" pfx:force-focus="m().focusForced">
* <a id="exp-model"></a>***``pfx:model``*** - Any modification of the value of the input type will be propagated to the model and visa versa.  Model representations with more than one possible value, such as a multi-select list, should be represented as an Array object.  (See [``pfx:each``](#exp-each) and [``item``](#exp-value))

		<input type="text" pfx:model="m().post.title" />

* <a id="exp-hidden"></a>***``pfx:hidden``*** - The parent node will be marked "hidden" (html boolean attribute) based on the evaluation of the attribute value.

		<span pfx:hidden="m().name.nick.length > 0">{{m().name.nick}}<br /></span>

* <a id="exp-if"></a>***``pfx:if``*** - Certain user stories may express requirements that exceed the capability of default HTML visble or hidden attributes.  Removal of a node from the DOM may be desireable while maintaining a reference/bookmark to desired location of placement if circumstances change.

		<div pfx:if="!m().hideImage"><img src="pathtoimg.jpg" /></div>

* <a id="exp-each"></a>***``pfx:each``*** - Repeating Cydran stuctures can be expressed with keyword and expresive structure.  The primary structure utilized is with the ``<template>`` tag with an attribute ``type`` of "item".  The various template types are comprised of:

	* ``empty`` - what displays when the source list is empty or null
	* ``first`` - what will go first in the list of items that is not part of the list, such as a null value placeholder
	* ``item`` - representation of each item in the list
	* ``after`` - the other end of the represented list opposing 'first' or as 'after all is done'
	* ``alt`` - use this template representation contingent on truthiness of expression

	Additional supported attributes on the ``<template>`` element used in a cydran context are:

	* ``pfx:component``- optional, referencing a Cydran component to be injected.  If the attribute is utilized and there is content in between the ``<template>`` tags, Cydran WILL throw an Error.  No use of this attribute implies the template representation for an anonymous Cydran component is expressed and should be utilized, also resulting in a thrown Error if not provided.

			<template pfx:component="xyz" pfx:value="v()" pfx:type="item"></template>
				<!-- OR -->
			<template pfx:value="v()" pfx:type="item">
				<div>
					<!-- additional markup -->
				</div>
			</template>
				<!-- NOT BOTH / Mutual Exclusivity -->

	* ``pfx:value`` - optional, typically the current interative value in the sequence is injected but an explicit or modified value may be specified by expression/functional reference.  May be used in combination with/without the ``component`` attribute.

	Template content <span style="color: red;">**must**</span> have a single top level HTML element or be declared as a placeholder to a known component.

		<select pfx:each="m().items"
			pfx:each:mode="none|generated|expression"
			pfx:model="m().selectedDropdownOption">
			<template pfx:type="empty" pfx:component="disabledOption"></template>
			<template pfx:type="first">
				<option disabled selected>Select One...</option>
			</template>
			<template pfx:type="item">
				<option value="{{v().id}}">{{v().title}}</option>
			</template>
		</select>

	* <a id="exp-each-mode"></a>***``pfx:each:mode``*** - **Required** [each](#exp-each) attribute indicating the each identity strategy of list elements as indicated by reserved word:
		* <a id="exp-each-mode-none"></a>***``none``***: The repeat item data source context is assumed to have an ``id`` attribute with a unique value.  Any context lacking the ``id`` field will log an Error but continue to render unless otherwise specified with an [``pfx:each:idkey``](#exp-each-idkey) attribute.  Such a circumstance may produce unexpected behaviors in the [``pfx:each``](#exp-each) render portion of the component and other adverse artifacts.  Use of [``pfx:each:idkey``](#exp-each-idkey) will cause the name ``id`` field reference to be used instead.

				pfx:each:idkey="fieldX" = reference an id in the indicated field of each item

		* <a id="exp-each-mode-generated"></a>***``generated``***: An identity reference will be added to the current item structure with the field name of ``id`` if not already extant with a v4 uuid value.  Unique enforcement is _ONLY_ applied to the expectation of generated id's and _NOT_ to potential conflicts arrising from items of the context or list that already have an id field present.

				pfx:each:idkey="<field_name>" = produce an uuidv4 in the indicated <field_name> attribute of each item

		* <a id="exp-each-mode-expression"></a>***``expression``***: a computed identity value is to be derived from the repeat item itself with a provided expression.  Such a strategy becomes neccessary with lists of primitives or other lists of objects where an non-extant id attribute composited into the existing data structure is disallowed or undesireable.

				pfx:each:expression="v()" = reference to the evaluated expression value

	* <a id="exp-each-idkey"></a>***``pfx:each:idkey``*** - **Optionally Required** attribute if designated/desired id field name is other than "id".  Applies to [``none``](#exp-each-mode-none) and [``generated``](#exp-each-mode-generated) modes of [``pfx:each``](#exp-each) operations

			<select pfx:each="m().items"
				pfx:each:mode="none|generated"
				pfx:each:idkey="xyz"
				pfx:model="m().selectedDropdownOption">
				<!-- ... -->
			</select>
	* <a id="exp-each-expression"></a>***``pfx:each:expression``*** - **Contextually Required** attribute if [``pfx:each:mode``](#exp-each-mode) indicates "expression" with a computed id value within the [``pfx:each``](#exp-each) item context.

			<select pfx:each="m().items"
				pfx:each:mode="expression"
				pfx:each:expression="v()"
				pfx:model="m().selectedDropdownOption">
				<!-- ... -->
			</select>

## <a id="exp">[Expressions](#concept-markup)</a>
An expression in Cydran <span style="color: red;">**is**</span> any valid Javascript expression that results in a value, object field reference, or functional invocation. The Javascript ``strict`` keyword is universally utilized and enforced.  Cydran expressions are used in specific [element mediators](#concept-elemmed) and within [curly brace](#exp-dynamic-anonymous) and [box bracket](#exp-onetime-anonymous) contexts.

### <a id="exp-core">[Core Functional Expressions](#concept-markup)</a>
* <a id="exp-model"></a>``m()`` - reference to the defined members and functions/methods of the Cydran component model.

		<input type="text"
			pfx:onblur="m().doWork()"
			pfx:model="m().variable"></input>

* <a id="exp-value"></a>``v()`` - reference to the model array item within a [repeating or "each"](#exp-each) context or defined Cydran [region](#tag-script) with an assigned component.

		<option value="{{v().id}}">{{v().title}}</option>

* <a id="exp-param"></a>``p(n)`` - utilized in special context of predicate expression formulation to indicate a parameter value representation supplied as an indexed argument to be evaluated as part of the predicate expression.

		.withPredicate("$index >= p(0)
			&& $index < p(1)", "m().value0", "m().value1")

### <a id="exp-anonymous">[Anonymous Value Expression](#concept-markup)</a>
* <a id="exp-dynamic-anonymous"></a>``{{}}`` (double brace bracket) - anonymous reference in a Cydran [template](#concept-markup) containing a valid Javascript (JS) expression with the expectation of a return value to be represented in the visible render of the active [component](#concept-component)... it participates in the digest cycle.

		<div>{{ m().data.value1 }}</div>

* <a id="exp-onetime-anonymous"></a>``[[]]`` (double box bracket) - same as the [double brace bracket](#exp-dynamic-anonymous) expression with a singular distinction of NOT participating in the Cydran [digest](#concept-digest) cycle once rendered.  It is a "one and done" kind of operation.  This is intended for "read-only" kinds of operations where a value change representation does not occur, is not needed, or undesired in the represented context.

		<label for="id">[[ i18n(m().labelValue) ]]</label>

## <a id="lifecycle">Lifecycle Events</a>
* Parent
	* [Before](#lifecycle-parent-before) - Added, Changed, Removed
	* [After](#lifecycle-parent-after) - Added, Changed, Removed
* Child
	* [Before](#lifecycle-child-before) - Added, Changed, Removed
	* [After](#lifecycle-child-after) - Added, Changed, Removed
* [OTHER](#lifecycle-other) - Dispose, Nesting Change

### <a id="lifecycle-parent-before"></a>PARENT - Before
* ``Events.BEFORE_PARENT_ADDED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* ``Events.BEFORE_PARENT_CHANGED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* ``Events.BEFORE_PARENT_REMOVED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lifecycle-parent-after"></a>PARENT - After
* ``Events.AFTER_PARENT_ADDED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent is set in component when prior parent was null

* ``Events.AFTER_PARENT_CHANGED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: New parent set regardless of prior or new parent being null

* ``Events.AFTER_PARENT_REMOVED``
	* Recipient: Component upon which the event occurred
	* Occurs: After state change occurrence
	* Significance: Parent is set null when prior parent was non-null

### <a id="lifecycle-child-before"></a>CHILD - Before
* ``Events.BEFORE_CHILD_ADDED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: New child component is set where child within affected region was null

* ``Events.BEFORE_CHILD_CHANGED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: New child component is set regardless of prior region population

* ``Events.BEFORE_CHILD_REMOVED``
	* Recipient: Component whose child has changed
	* Occurs: Before state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lifecycle-child-after"></a>CHILD - After
* ``Events.AFTER_CHILD_ADDED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: New child component is set where child within affected region was null

* ``Events.AFTER_CHILD_CHANGED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: New child component is set regardless of prior region population

* ``Events.AFTER_CHILD_REMOVED``
	* Recipient: Component whose child has changed
	* Occurs: After state change occurrence
	* Significance: Child is set null when prior child was non-null

### <a id="lifecycle-other"></a>Other
* ``Events.COMPONENT_NESTING_CHANGED``
	* Recipient: Global
	* Occurs: When the nesting of components is changed
	* Significance: When the nesting of components is changed.  This should be very infrequently.

* ``Events.BEFORE_DISPOSE``
	* Recipient: Component upon which the event occurred
	* Occurs: Before disposal of component
	* Significance: Last gasp of component (requisite clean-up)
