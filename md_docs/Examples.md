# Cydran Examples

## Critial Javascript Principles

### Immutable Data
### ???

1. Messaging
2. Components & Templates
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

## Components & Templates & Regions

A Component the cydran object that controls the HTML that the user sees.  A user Component is an extension of a Cydran Component and is made up of a Template (Visible) and Code (Invisible).

		MyComponent extends cydran.Component {
			constructor() {
				let MyTemplate = "<div></div>";
				super(Mytemplate); 
			}
		}

Templates are (usually) strings that the Cydran Component converts into a renderable DOM structure and then push into the web document.  
Templates are static and are processed using super during component construction.  I like to think of the Template and Component as a Coin with a Front (Template) and Back (Component), because the component controls the Template.  Another analogy to to call the Template a puppet and the Component is the puppet master;

Regions in Template: Regions are template areas that hold other components.  A component can be placed, removed or swapped within a region. To extend the Puppet analogy, the puppet master can't remove the puppets hand, rather the puppet master places something (or nothing) into the puppets hand.  

During the rendering process Curran first processes all aliases and decoratersevaluating all  by evaluating cydran aliases. 

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
