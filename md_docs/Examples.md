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

