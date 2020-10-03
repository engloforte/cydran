# Cydran Examples

## Critial Javascript Principles

### Immutable Data
### ???

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
1. another list
## Templates
Templates are nothing more than a string representation of the DOM.  Cydran converts the template string into a renderable DOM structure by evaluating cydran aliases. 

Observations:

1. Templates can only have 1 root element.

	Acceptable Templates
	* <div><div>Div1</div><div>Div2</div>...</div>
	* <div><span>Hello World</span> Whatever you want</div>
	* <table><tr><td>Cell 1</td><td>Cell 1</td></tr></table>
	
	Unacceptable Templates
	* <div></div><div></div>
	

1. Templates evaluate ***``Aliases``*** 

	{{m().myComponentValue}} 
	
1. Templates 

***NOTE: Templates are processed by the browser's Parser so any syntax that the Parser does not understand will loose meaning.  Where this becomes apparent quickly is IE11 does not unerstand the element `<template>`, so in order to use the element `<template>` a polyfill is required.***

	const TEMPLATE = "<div></div>"
	
###

