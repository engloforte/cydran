# Cydran Examples

## Critial Javascript Principles

### Immutable Data
### ???

1. Messaging
2. Templatization
3. Registry
4. Initialization

## Messaging

  Basic Messaging requies:
1. ***``Message Type``*** - string defining the messageType
1. ***``Channel Name``*** - string defining the channel name
1. ***``Payload``*** - can be any object, a number, string, array, object
1. ***``Invoke Function``*** - when an object recieves a message from the pubSub system, it calls the invoke function passing the payload as a parameter.

Observations:

* Messages are handled immediately
* Invoke Functions return value will always be lost (so don't try to return a value)

		class myClass extends Component {
			constructor() {
				super(TEMPLATE_STRING);
				
				// listening for direct messages
				this.on("messageType").invoke(this.myInvokeFunction);
				// listening for broadcast messages
				this.on("messageType").forChannel("channelName").invoke(this.myInvokeFunction);
			}
		
			sendMessage() {
				// publish a message directly
				this.message("channelName", "messageType", '');
				// broadcast a message
				this.broadcast("channelName", "messageType", { payloadProperty1: 'prop1'});
				// broadcast a message in the Cydran global scope
				this.broadcastGlobally("channelName", "messageType", [ 'element1', 'element2' ]);
			}
			
			myFunction(payload) {
				console.log(payload);
			}
    
    	}
		
[//]: # (New List)

	// An example of sending a message directly to the parent.
	this.parent.getParent().message('messageType? or channelName?', "digest");

## Templates
Templates are strings that Cydran converts into a renderable DOM structure and then push into the web document.  During the rendering process Curran first processes all aliases and decoratersevaluating all  by evaluating cydran aliases. 

Observations:

1. Templates can only have 1 root element.

	Acceptable Templates
	
	* ``<div><div>Div1</div><div>Div2</div>...</div>``
	
	* ``<div><span>Hello World</span> Whatever you want</div>``
	
	* ``<table><tr><td>Cell 1</td><td>Cell 1</td></tr></table>``
	
	Unacceptable Templates
	
	* ``<div></div><div></div>``
	

1. Templates evaluate ***``Aliases``*** 
	With 1 exception, aliases are processed during every digest cycle.  If they have changed, the value written to the DOM is updated to reflect the change in data.

	``{{m().myComponentValue}}``
	
1. Templates Element Properties
	
	``c:onclick="m().myFunction()"``

	``

### Template Construction

	``c:hidden``

	``c:model``

	``c:style``

	``c:class``

	``c:``

	``c:if``

	``c:if``


***NOTE: Templates are processed by the browser's Parser so any syntax that the Parser does not understand will loose meaning.  Where this becomes apparent quickly is IE11 does not unerstand the element `<template>`, so in order to use the element `<template>` a polyfill is required.***

## Registry
The registry is a global utility that allows easy access to functions, objects and properties from any Curran object..
The registry key is unique and if a duplicate key is added it will... 

### Objects

``WithSingleton`` - registers a new utility.  The first get call will instantiate a new object and return it.  All subsequent calls return the original object.

	// Create Registry Key
 	Stage.withSingleton('myKey1', MyClassToBeInstantiated)
	
	// Creates MyClassObject from new MyClassToBeInstantiated 
	let MyClassObject = this.get('myKey1');
	
	// Returns previously created MyClassObject
	let MyClassObjectCopy = this.get(myKey1');

``WithPrototype`` - register a new utility.  A new object is created each time get is called.

	// Create Registry Key
 	Stage.withPrototype('myKey1', MyClassToBeInstantiated)
	
	// Creates MyClassObject1 from new MyClassToBeInstantiated 
	let MyClassObject1 = this.get('myKey1');
	
	// Creates MyClassObject2 from new MyClassToBeInstantiated
	let MyClassObject2 = this.get(myKey1');

Key, object, list of parameters to pass to constructor
		
``withScopeItem`` - A function or property to be used in the template.

	// Create Registry Key
	Stage.withScopeItem('upper', (str: string) => str.toUpperCase())
	
	// Template Fragment
	... [[ upper("mYnAmE") ]] ...
	
	// Renders
	... MYNAME ...
	
		or if used in withInitializer
		
	// Inside withInitializer callback function
	stage.withCapability(scopeItemCapability)
	
``withInitializer`` - Allows the initialization to happen in pieces.  A package can add its registry items to the registry and initialize things that are needed for it to perform correctly.

	// Main Stage Builder
	const stage = builder("body")
		.withDebugLogging()
		.withCapability(initPackage)
		.withInitializer((stage) => {
			stage.setComponent(new App());
			window.PackageObj2 = this.get('myKey2');
			console.log('Stage Initialized');			
		})
		.build();

	stage.start();
	
	// Package Builder
	function initPackage(stage) {
		stage
			.withSingleton('myKey1', PackageObj1ToBeInstantiated)
			.withPrototype('myKey2', PackageObj2ToBeInstantiated)
			.withInitializer((stage) => {
				window.PackageObj1 = this.get('myKey1');
				console.log('Package Initialized');
			}
	}

	// Output
	Package Initialized
	Stage Initialized

### Capabilities (Functions)
``WithCapability`` - This gives modules the ability to add to the registry and do initialization as a unit when additional functions/objects/properties/features are added

### Properties

  	builder.withProperties({
  		"cydran.production.enabled": false,
  		"custom.property1": "xyz1"
  	})

  	builder.withProperties({
  		"cydran.production.enabled": true,
  		"custom.property2": "xyz2"
  	})
	
	this.getProperties().get('cydran.production.enabled'); // returns true
	this.getProperties().get('custom.property1'); // returns xyz1
	this.getProperties().get('custom.property2'); // returns xyz2


